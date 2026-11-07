import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, getErrorMessage } from '../services/api';

const defaultValues = {
  title: '',
  company: '',
  location: '',
  description: '',
  salary: '',
  job_type: 'Full-time',
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createJob({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        salary: form.salary === '' ? null : Number(form.salary),
        job_type: form.job_type,
      });

      setSuccess('Job created successfully.');
      setForm(defaultValues);
      navigate('/jobs');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Create role</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Post a new job</h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 md:col-span-1">
            Job title
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Senior Product Designer"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-1">
            Company name
            <input
              required
              name="company"
              value={form.company}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Northstar Labs"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-1">
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Hyderabad"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-1">
            Job type
            <select
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Salary
            <input
              name="salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="800000"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              placeholder="Describe the role, responsibilities, and impact."
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(defaultValues)}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'Creating...' : 'Create job'}
          </button>
        </div>
      </form>
    </div>
  );
}
