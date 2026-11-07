import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import { deleteJob, getErrorMessage, searchJobs } from '../services/api';
import type { Job, SearchFilters } from '../types/job';

const defaultFilters: SearchFilters = {
  title: '',
  location: '',
  job_type: '',
  min_salary: '',
  max_salary: '',
};

export default function SearchJobs() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasActiveFilter = useMemo(
    () => Object.values(filters).some((value) => value && value.toString().trim() !== ''),
    [filters],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await searchJobs({
        title: filters.title,
        location: filters.location,
        job_type: filters.job_type,
        min_salary: filters.min_salary,
        max_salary: filters.max_salary,
      });
      setJobs(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setJobs([]);
    setError('');
  };

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(jobId);
      setJobs((current) => current.filter((job) => job.id !== jobId));
      window.alert('Job deleted successfully');
    } catch (err) {
      window.alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-sky-700">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Search and filter</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700">
            Job title
            <input
              name="title"
              value={filters.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Python Developer"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Hyderabad"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Job type
            <select
              name="job_type"
              value={filters.job_type}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
            >
              <option value="">All types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Min salary
            <input
              name="min_salary"
              type="number"
              value={filters.min_salary}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="500000"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Max salary
            <input
              name="max_salary"
              type="number"
              value={filters.max_salary}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="2000000"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            <Trash2 size={15} />
            Clear filters
          </button>
          <button
            type="button"
            onClick={() => void handleApply()}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
          >
            <Search size={15} />
            Search jobs
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <Loading label="Searching jobs..." />
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          {hasActiveFilter ? 'No jobs match your current filters.' : 'Search by title, location, salary or job type to find the right role.'}
        </div>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
