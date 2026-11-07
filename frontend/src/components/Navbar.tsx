import {
  BriefcaseBusiness,
  LayoutDashboard,
  PlusCircle,
  Search,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'All Jobs', to: '/jobs', icon: BriefcaseBusiness },
  { label: 'Search Jobs', to: '/jobs/search', icon: Search },
  { label: 'Create Job', to: '/jobs/new', icon: PlusCircle },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-lg shadow-sky-200">
            J
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">portal</p>
            <h1 className="text-xl font-bold text-slate-900">JobBoard</h1>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
