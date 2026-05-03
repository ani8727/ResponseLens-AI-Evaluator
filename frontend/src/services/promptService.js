import axiosClient from '../api/axiosClient.js'

export const submitPrompt = async (payload) => {
  const { data } = await axiosClient.post('/prompts', payload)
  return data
}

export const fetchPromptHistory = async (page = 0, size = 10) => {
  const { data } = await axiosClient.get('/prompts', {
    params: { page, size },
  })
  return data
}
