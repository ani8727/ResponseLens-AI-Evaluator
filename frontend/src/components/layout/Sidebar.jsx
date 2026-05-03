import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'Prompt History' },
  { to: '/evaluation', label: 'Evaluation' },
  { to: '/profile', label: 'Profile' },
]

const adminLinks = [
  { to: '/admin-dashboard', label: 'Admin Dashboard' },
]

function Sidebar() {
  const { isAdmin } = useAuth()

  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/70 p-6 md:block">
      <h1 className="text-xl font-semibold text-cyan-500">ResponseLens</h1>
      <p className="mt-1 text-xs text-slate-400">AI Evaluation Platform</p>
      <nav className="mt-8 space-y-2">
        {userLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="mt-6 border-t border-slate-700 pt-6">
              <p className="text-xs font-semibold uppercase text-slate-500">Admin</p>
            </div>
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
