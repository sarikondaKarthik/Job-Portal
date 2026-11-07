export type Job = {
  id: number;
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  salary?: number | null;
  job_type?: string | null;
};

export type JobPayload = {
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  salary?: number | null;
  job_type?: string | null;
};

export type SearchFilters = {
  title: string;
  location: string;
  job_type: string;
  min_salary: string;
  max_salary: string;
};
