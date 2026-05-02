import apiClient from './api'

export const progressService = {
  getProgress: async () => {
    try {
      const response = await apiClient.get('/auth/progress')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch progress activity' }
    }
  },

  updateProgress: async (date, level) => {
    try {
      const response = await apiClient.put('/auth/progress', { date, level })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update progress activity' }
    }
  },
}
