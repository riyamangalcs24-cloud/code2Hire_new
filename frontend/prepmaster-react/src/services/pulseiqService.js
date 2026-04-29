import apiClient from './api'

const ANON_KEY = 'pulseiqAnonymousId'

const getAnonymousId = () => {
  const existingId = localStorage.getItem(ANON_KEY)
  if (existingId) {
    return existingId
  }

  const newId = `anon_${crypto.randomUUID()}`
  localStorage.setItem(ANON_KEY, newId)
  return newId
}

export const pulseiqService = {
  track: async (eventName, userId = null, properties = {}) => {
    try {
      await apiClient.post('/analytics/event', {
        eventName,
        userId: userId || undefined,
        anonymousId: getAnonymousId(),
        properties,
      })
    } catch {
      // Analytics should never break the UX flow.
    }
  },

  identify: async (userId, traits = {}) => {
    if (!userId) {
      return
    }

    await pulseiqService.track('identify', userId, traits)
  },

  trackPageView: async (userId = null, properties = {}) => {
    await pulseiqService.track('page_view', userId, properties)
  },

  getAnonymousId,
}
