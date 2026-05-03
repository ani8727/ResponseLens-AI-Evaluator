import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../hooks/useTheme.js'

function Navbar() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-cyan-600"></div>
        <h1 className="text-xl font-bold text-white">ResponseLens</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '🌞 Light' : '🌙 Dark'}
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
