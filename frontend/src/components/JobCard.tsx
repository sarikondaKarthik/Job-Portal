import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../types/job';

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) {
    return 'Negotiable';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

type JobCardProps = {
  job: Job;
  onDelete: (jobId: number) => void;
};

export default function JobCard({ job, onDelete }: JobCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{job.job_type || 'Full-time'}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
          {job.company}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-slate-400" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          <span>{job.location || 'Remote / Flexible'}</span>
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={16} className="text-slate-400" />
          <span>{formatCurrency(job.salary)}</span>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {job.description || 'No description provided for this role.'}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span>ID #{job.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            View Details
            <ArrowRight size={15} />
          </Link>

          <Link
            to={`/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <Pencil size={15} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(job.id)}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
