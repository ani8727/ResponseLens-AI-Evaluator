import axios from 'axios'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1').replace(/\/+$/, '')

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('responselens_token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// --- TASK 2 FIX START: Enhanced response interceptor for global error handling ---
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      let errorMessage = data?.message || 'An unexpected error occurred.'

      switch (status) {
        case 401:
          console.warn('API: Unauthorized (401). Removing token and redirecting to login.')
          localStorage.removeItem('responselens_token')
          // AuthContext will handle the redirect based on isAuthenticated state
          errorMessage = data?.message || 'Your session has expired. Please log in again.'
          break
        case 403:
          console.warn('API: Forbidden (403). User does not have access.')
          errorMessage = data?.message || 'You do not have permission to perform this action.'
          break
        case 404:
          errorMessage = data?.message || 'The requested resource was not found.'
          break
        case 429: // Too Many Requests (e.g., Gemini quota)
          errorMessage = data?.message || 'Too many requests. Please try again later.'
          break
        case 500:
          errorMessage = data?.message || 'Internal server error. Please try again later.'
          break
        default:
          errorMessage = data?.message || `API Error: ${status}. An unexpected error occurred.`
      }
      // Overwrite the error message with a more user-friendly one
      error.message = errorMessage
    } else if (error.request) {
      // The request was made but no response was received
      error.message = 'Network error. Please check your internet connection.'
    } else {
      // Something happened in setting up the request that triggered an Error
      error.message = 'Request failed. Please try again.'
    }
    return Promise.reject(error)
  },
)
// --- TASK 2 FIX END ---

export default axiosClient
