import axiosClient from '../api/axiosClient.js'

export const createEvaluation = async (payload) => {
  const { data } = await axiosClient.post('/evaluations', payload)
  return data
}
