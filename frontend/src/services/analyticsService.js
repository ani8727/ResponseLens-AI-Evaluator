import axiosClient from '../api/axiosClient.js'

export const fetchDashboardSummary = async () => {
  const { data } = await axiosClient.get('/admin/analytics/summary')
  return data
}
