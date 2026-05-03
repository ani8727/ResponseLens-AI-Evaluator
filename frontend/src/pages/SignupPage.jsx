import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useAsyncAction } from '../hooks/useAsyncAction.js' // Update import path

const initialState = {
  name: '',
  email: '',
  password: '',
}

function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [formState, setFormState] = useState(initialState)
  const [localError, setLocalError] = useState('') // For form-specific errors

  // Use useAsyncAction for signup
  const { execute: executeSignup, isLoading: isSubmitting, error: signupError } = useAsyncAction(
    signup,
    'Account created successfully! Welcome to ResponseLens.'
  );

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError(''); // Clear local form errors
    try {
      await executeSignup(formState)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Errors are handled by useAsyncAction and shown as toasts
      setLocalError(err.message || 'Unable to signup. Please try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <AuthForm
        title="Create ResponseLens account"
        subtitle="Set up your workspace and start AI response evaluations."
        fields={[
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Aniket Sharma' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: '********' },
        ]}
        formState={formState}
        setFormState={setFormState}
        onSubmit={handleSubmit}
        error={localError || signupError}
        isSubmitting={isSubmitting}
        footer={
          <>
            New here?{' '}
            <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </>
        }
      />
    </div>
  )
}

export default SignupPage
