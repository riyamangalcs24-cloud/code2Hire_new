import axios from 'axios'
import { createRequestInterceptor, createResponseInterceptor } from '../utils/apiInterceptors'
import config from '../config/config'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.api.timeout,
})

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Apply custom interceptors
createRequestInterceptor(apiClient)
createResponseInterceptor(apiClient)

export default apiClient
