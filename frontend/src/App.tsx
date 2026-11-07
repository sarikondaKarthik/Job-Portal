import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllJobs from './pages/AllJobs';
import CreateJob from './pages/CreateJob';
import Dashboard from './pages/Dashboard';
import EditJob from './pages/EditJob';
import JobDetails from './pages/JobDetails';
import SearchJobs from './pages/SearchJobs';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/search" element={<SearchJobs />} />
          <Route path="/jobs/new" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/edit" element={<EditJob />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
