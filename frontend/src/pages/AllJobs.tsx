import { useEffect, useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { deleteJob, fetchPaginatedJobs, fetchSortedJobs, getErrorMessage } from '../services/api';
import type { Job } from '../types/job';

export default function AllJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');

  const loadJobs = async (nextPage = page, nextPageSize = pageSize) => {
    try {
      setLoading(true);
      const data =
        sortOrder === 'default'
          ? await fetchPaginatedJobs({ page: nextPage, pageSize: nextPageSize })
          : await fetchSortedJobs(sortOrder);
      setJobs(data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, [sortOrder]);

  const handleSortChange = async (nextOrder: 'asc' | 'desc' | 'default') => {
    setSortOrder(nextOrder);
    setPage(1);
    if (nextOrder === 'default') {
      await loadJobs(1, pageSize);
      return;
    }
    await loadJobs(1, pageSize);
  };

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(jobId);
      await loadJobs(page, pageSize);
      window.alert('Job deleted successfully');
    } catch (err) {
      window.alert(getErrorMessage(err));
    }
  };

  const handlePageChange = async (direction: 'prev' | 'next') => {
    const nextPage = direction === 'prev' ? Math.max(1, page - 1) : page + 1;
    setPage(nextPage);
    await loadJobs(nextPage, pageSize);
  };

  const handlePageSizeChange = async (nextSize: number) => {
    setPageSize(nextSize);
    setPage(1);
    await loadJobs(1, nextSize);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Job listings</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">All jobs</h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span>Sort salary</span>
            <select
              value={sortOrder}
              onChange={(event) => {
                const nextValue = event.target.value as 'asc' | 'desc' | 'default';
                void handleSortChange(nextValue);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300"
            >
              <option value="default">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </label>
          <Link
            to="/jobs/new"
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
          >
            <Plus size={16} />
            Create job
          </Link>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <Loading label="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No jobs available right now. Create a new vacancy to get started.
        </div>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        hasPrevious={page > 1}
        hasNext={jobs.length >= pageSize}
        onPrevious={() => void handlePageChange('prev')}
        onNext={() => void handlePageChange('next')}
        onPageSizeChange={(value) => void handlePageSizeChange(value)}
      />
    </div>
  );
}
