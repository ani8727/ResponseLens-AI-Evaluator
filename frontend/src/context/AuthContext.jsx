import { useEffect, useMemo, useState, createContext } from 'react'
import { fetchCurrentUser, loginUser, signupUser, updateProfile as updateProfileService, deactivateAccount as deactivateAccountService } from '../services/authService.js'
import { useToast } from '../hooks/useToast.jsx' // Update import path

export const AuthContext = createContext(null)

const TOKEN_KEY = 'responselens_token' // Still used for old localStorage cleanup, but not for active token management

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const { error: toastError } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      // Clean up any old localStorage token
      if (localStorage.getItem(TOKEN_KEY)) {
        localStorage.removeItem(TOKEN_KEY);
      }

      try {
        const currentUser = await fetchCurrentUser() // This call will succeed if HttpOnly cookie is present and valid
        setUser(currentUser)
      } catch (error) {
        // If /auth/me fails, it means no valid cookie/session
        setUser(null); // Ensure user is null
        const errorMessage = error.message || 'Session expired. Please log in again.';
        setAuthError(errorMessage);
        toastError(errorMessage);
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    setAuthError('')
    try {
      const response = await loginUser(credentials) // Backend now sets HttpOnly cookie
      setUser(extractUser(response)) // User data is still in response body
      return response
    } catch (error) {
      const errorMessage = error.message || 'Login failed.';
      setAuthError(errorMessage);
      toastError(errorMessage);
      throw error;
    }
  }

  const signup = async (payload) => {
    setAuthError('')
    try {
      const response = await signupUser(payload) // Backend now sets HttpOnly cookie
      setUser(extractUser(response)) // User data is still in response body
      return response
    } catch (error) {
      const errorMessage = error.message || 'Signup failed.';
      setAuthError(errorMessage);
      toastError(errorMessage);
      throw error;
    }
  }

  const updateProfile = async (payload) => {
    try {
      const updatedUser = await updateProfileService(payload);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed.';
      toastError(errorMessage);
      throw error;
    }
  }

  const deactivateAccount = async () => {
    try {
      await deactivateAccountService();
      logout();
    } catch (error) {
      const errorMessage = error.message || 'Account deactivation failed.';
      toastError(errorMessage);
      throw error;
    }
  }

  const logout = () => {
    // Invalidate HttpOnly cookie on logout
    // Backend needs an endpoint to clear the HttpOnly cookie
    // For now, we just clear frontend state. The cookie will eventually expire or be cleared by backend on next 401.
    // A dedicated /auth/logout endpoint on backend would be ideal to clear the cookie.
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'ROLE_ADMIN',
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      login,
      signup,
      updateProfile,
      deactivateAccount,
      logout,
    }),
    [user, isLoading, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// No longer extracting token from response body
// function extractToken(response) {
//   return response?.token ?? response?.accessToken ?? response?.jwt ?? null
// }

function extractUser(response) {
  return response?.user ?? response?.data?.user ?? null
}
