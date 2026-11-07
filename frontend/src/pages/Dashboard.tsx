import { ArrowUpRight, BriefcaseBusiness, Building2, CircleDollarSign, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import type { Job } from '../types/job';
import { fetchAllJobs, getErrorMessage } from '../services/api';

const statCards = [
  { label: 'Open roles', valueKey: 'totalJobs', icon: BriefcaseBusiness, accentClass: 'bg-sky-100 text-sky-600' },
  { label: 'Remote ready', valueKey: 'remoteJobs', icon: Search, accentClass: 'bg-indigo-100 text-indigo-600' },
  { label: 'Avg. salary', valueKey: 'avgSalary', icon: CircleDollarSign, accentClass: 'bg-emerald-100 text-emerald-600' },
  { label: 'Growth', valueKey: 'growthRate', icon: TrendingUp, accentClass: 'bg-violet-100 text-violet-600' },
] as const;

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchAllJobs();
        setJobs(data);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void loadJobs();
  }, []);

  const totalJobs = jobs.length;
  const remoteJobs = jobs.filter((job) => /remote|hybrid|virtual/i.test(job.location || '')).length;
  const avgSalary = jobs.length
    ? Math.round(jobs.reduce((sum, job) => sum + (job.salary ?? 0), 0) / jobs.length)
    : 0;

  const stats = {
    totalJobs,
    remoteJobs,
    avgSalary: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(avgSalary),
    growthRate: `${Math.min(34, Math.max(6, Math.round((jobs.length / 10) * 100) || 8))}%`,
  };

  const recentJobs = [...jobs].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-sky-800 to-blue-700 p-6 text-white shadow-xl shadow-sky-200 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Find the right role for your next move</h2>
            <p className="mt-4 max-w-xl text-sm text-sky-100 md:text-base">
              Explore curated jobs, track hiring momentum, and manage openings from a single professional dashboard.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Browse jobs
                <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/jobs/new"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Post a job
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
            <div className="flex items-center justify-between">
              <p className="text-sky-100">Live listings</p>
              <Building2 className="text-sky-200" />
            </div>
            <p className="mt-4 text-4xl font-bold">{totalJobs}</p>
            <p className="mt-2 text-sm text-sky-100">Jobs available across teams and locations</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, valueKey, icon: Icon, accentClass }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats[valueKey as keyof typeof stats]}</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClass}`}>
                <Icon size={18} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Recently posted</h3>
            <Link to="/jobs" className="text-sm font-medium text-sky-700 hover:text-sky-800">View all</Link>
          </div>

          {loading ? (
            <Loading label="Loading recent opportunities..." />
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : recentJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No jobs available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">{job.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {job.company} · {job.location || 'Remote'}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-sky-700">{job.job_type || 'Full-time'}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Quick access</h3>
          <div className="mt-5 space-y-3">
            <Link to="/jobs" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
              Manage all jobs
            </Link>
            <Link to="/jobs/search" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
              Search and filter roles
            </Link>
            <Link to="/jobs/new" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
              Create a new listing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
