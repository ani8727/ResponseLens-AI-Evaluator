import axiosClient from '../api/axiosClient.js'

export const loginUser = async (payload) => {
  const { data } = await axiosClient.post('/auth/login', payload)
  return data
}

export const signupUser = async (payload) => {
  const { data } = await axiosClient.post('/auth/signup', payload)
  return data
}

export const fetchCurrentUser = async () => {
  const { data } = await axiosClient.get('/auth/me')
  return data
}

export const updateProfile = async (payload) => {
  const { data } = await axiosClient.put('/auth/profile', payload)
  return data
}

export const deactivateAccount = async () => {
  await axiosClient.delete('/auth/deactivate')
}
