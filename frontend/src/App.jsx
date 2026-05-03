import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import AdminProtectedRoute from './components/protected/AdminProtectedRoute.jsx' // Import AdminProtectedRoute
import ProtectedRoute from './components/protected/ProtectedRoute.jsx'
import { useAuth } from './hooks/useAuth.js'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx' // Import AdminDashboardPage
import DashboardPage from './pages/DashboardPage.jsx'
import EvaluationPage from './pages/EvaluationPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PromptHistoryPage from './pages/PromptHistoryPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<PromptHistoryPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* --- TASK 5 FIX START: Admin Protected Route --- */}
      <Route
        element={
          <AdminProtectedRoute>
            <AppLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      </Route>
      {/* --- TASK 5 FIX END --- */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
