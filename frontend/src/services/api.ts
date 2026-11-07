import axios from 'axios';
import type { Job, JobPayload, SearchFilters } from '../types/job';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 20000,
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg ?? item).join(', ');
    }

    if (detail && typeof detail === 'object') {
      return JSON.stringify(detail);
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export async function fetchAllJobs(): Promise<Job[]> {
  const response = await api.get<Job[]>('/jobs');
  return response.data;
}

export async function fetchJobById(jobId: number): Promise<Job> {
  const response = await api.get<Job>(`/jobs/${jobId}`);
  return response.data;
}

export async function createJob(payload: JobPayload): Promise<Job> {
  const response = await api.post<Job>('/jobs', payload);
  return response.data;
}

export async function updateJob(jobId: number, payload: JobPayload): Promise<Job> {
  const response = await api.put<Job>(`/jobs/${jobId}`, payload);
  return response.data;
}

export async function patchJob(jobId: number, payload: Partial<JobPayload>): Promise<Job> {
  const response = await api.patch<Job>(`/jobs/${jobId}`, payload);
  return response.data;
}

export async function deleteJob(jobId: number): Promise<void> {
  await api.delete(`/jobs/${jobId}`);
}

export async function searchJobs(filters: Partial<SearchFilters>): Promise<Job[]> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      return trimmedValue !== '' && trimmedValue !== undefined && trimmedValue !== null;
    }),
  );

  const response = await api.get<Job[]>('/jobs/search', { params });
  return response.data;
}

export async function fetchPaginatedJobs({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<Job[]> {
  const response = await api.get<Job[]>('/jobs/pagination', {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

export async function fetchSortedJobs(order: 'asc' | 'desc'): Promise<Job[]> {
  const response = await api.get<Job[]>('/jobs/sort', {
    params: { order },
  });
  return response.data;
}
