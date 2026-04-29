import apiClient from './api'

export const roadmapService = {
  getRoadmap: async () => {
    try {
      const response = await apiClient.get('/roadmap')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch roadmap' }
    }
  },
}
