import { CalendarDays, Building2, MapPin, BriefcaseBusiness, IndianRupee, Hash, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { fetchJobById, getErrorMessage } from '../services/api';
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

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      if (!id) {
        setError('Missing job identifier.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchJobById(Number(id));
        setJob(response);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void loadJob();
  }, [id]);

  if (loading) {
    return <Loading label="Loading job details..." />;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-sky-700">
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error || 'Job not found.'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-sky-700">
        <ArrowLeft size={16} />
        Back to jobs
      </Link>

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-sky-900 to-blue-700 px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{job.job_type || 'Full-time'}</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">{job.title}</h2>
            </div>
            <Link
              to={`/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Edit job
            </Link>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-slate-700">
              <Building2 size={18} className="text-sky-600" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <MapPin size={18} className="text-sky-600" />
              <span>{job.location || 'Remote / Flexible'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <BriefcaseBusiness size={18} className="text-sky-600" />
              <span>{job.job_type || 'Full-time'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <IndianRupee size={18} className="text-sky-600" />
              <span>{formatCurrency(job.salary)}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Hash size={18} className="text-sky-600" />
              <span>Job ID: {job.id}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              <CalendarDays size={16} className="text-sky-600" />
              Role summary
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {job.description || 'No detailed description was provided for this role.'}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
