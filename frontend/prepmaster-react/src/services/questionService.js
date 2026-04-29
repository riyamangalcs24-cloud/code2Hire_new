import apiClient from './api'

export const questionService = {
  // Fetch all questions
  getQuestions: async () => {
    try {
      const response = await apiClient.get('/questions')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch questions' }
    }
  },

  // Fetch questions by domain
  getQuestionsByDomain: async (domain) => {
    try {
      const response = await apiClient.get(`/questions?domain=${domain}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch questions' }
    }
  },

  // Get single question
  getQuestion: async (id) => {
    try {
      const response = await apiClient.get(`/questions/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch question' }
    }
  },
}
