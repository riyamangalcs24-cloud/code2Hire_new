import { useState, useCallback } from 'react'
import { questionService } from '../services/questionService'
import { getErrorMessage } from '../utils/errorHandler'

export const useQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuestions = useCallback(async (domain = null) => {
    try {
      setLoading(true)
      setError(null)
      const data = domain 
        ? await questionService.getQuestionsByDomain(domain)
        : await questionService.getQuestions()
      setQuestions(data)
      return data
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getQuestion = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      const data = await questionService.getQuestion(id)
      return data
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    getQuestion,
  }
}
