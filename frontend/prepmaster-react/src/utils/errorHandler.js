// Centralized error handling utility

export class APIError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.details = details
  }
}

export const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    throw new APIError(
      data?.message || 'Request failed',
      status,
      data
    )
  } else if (error.request) {
    // Request made but no response
    throw new APIError('No response from server', 0, null)
  } else {
    // Error in request setup
    throw new APIError(error.message || 'Request failed', -1, null)
  }
}

export const getErrorMessage = (error) => {
  if (error instanceof APIError) {
    return error.message
  }
  return error?.message || 'An unexpected error occurred'
}
