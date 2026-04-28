import apiClient from './api'

export const domainService = {
  getDomains: async () => {
    try {
      const response = await apiClient.get('/domains')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch domains' }
    }
  },

  getTopicDetail: async (domainId, categoryId, topicId) => {
    try {
      const response = await apiClient.get(`/domains/${domainId}/categories/${categoryId}/topics/${topicId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch topic detail' }
    }
  },
}
