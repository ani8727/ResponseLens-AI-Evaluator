import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-white">404</h1>
        <p className="mt-2 text-slate-400">The page you requested does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-slate-950"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
