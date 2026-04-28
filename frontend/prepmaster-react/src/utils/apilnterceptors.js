// Production-level API utilities

export const createRequestInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add request tracking for monitoring
      config.metadata = { startTime: Date.now() }
      
      // Add any additional headers needed
      config.headers['X-Request-ID'] = generateRequestId()
      config.headers['X-Timestamp'] = new Date().toISOString()
      
      return config
    },
    (error) => Promise.reject(error)
  )
}

export const createResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Log response time in development
      if (import.meta.env.DEV && response.config.metadata) {
        const duration = Date.now() - response.config.metadata.startTime
        console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`)
      }
      return response
    },
    (error) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      } else if (error.response?.status === 403) {
        // Forbidden
        console.error('[API] Access forbidden', error.response.data)
      } else if (error.response?.status === 500) {
        // Server error
        console.error('[API] Server error', error.response.data)
      }
      return Promise.reject(error)
    }
  )
}

function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
