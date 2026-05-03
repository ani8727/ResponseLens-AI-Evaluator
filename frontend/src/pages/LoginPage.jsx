import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useAsyncAction } from '../hooks/useAsyncAction.js' // Update import path

const initialState = {
  email: '',
  password: '',
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formState, setFormState] = useState(initialState)
  const [localError, setLocalError] = useState('') // For form-specific errors

  // Use useAsyncAction for login
  const { execute: executeLogin, isLoading: isSubmitting, error: loginError } = useAsyncAction(
    login,
    'Logged in successfully!'
  );

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError(''); // Clear local form errors
    try {
      await executeLogin(formState)
      const redirectTo = location.state?.from?.pathname ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      // Errors are handled by useAsyncAction and shown as toasts
      setLocalError(err.message || 'Unable to login. Please try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <AuthForm
        title="Login to ResponseLens"
        subtitle="Evaluate AI responses with your JWT secured backend."
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: '********' },
        ]}
        formState={formState}
        setFormState={setFormState}
        onSubmit={handleSubmit}
        error={localError || loginError}
        isSubmitting={isSubmitting}
        footer={
          <>
            New here?{' '}
            <Link to="/signup" className="text-cyan-300 hover:text-cyan-200">
              Create an account
            </Link>
          </>
        }
      />
    </div>
  )
}

export default LoginPage
