// Application Configuration
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PrepMaster',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 seconds
  },
  auth: {
    tokenKey: 'authToken',
    userKey: 'user',
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  },
  features: {
    enableAnalytics: import.meta.env.MODE === 'production',
    enableDebug: import.meta.env.MODE === 'development',
  },
}

export default config
