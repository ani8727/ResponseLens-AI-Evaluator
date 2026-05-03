import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import LoadingSpinner from '../common/LoadingSpinner.jsx'

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Verifying your session..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    // Redirect non-admin users to dashboard or a 403 page
    return <Navigate to="/dashboard" replace state={{ from: location, message: 'Access Denied' }} />
  }

  return children
}

export default AdminProtectedRoute
