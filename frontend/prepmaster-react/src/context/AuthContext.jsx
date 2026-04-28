import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './authContextInstance'
import { pulseiqService } from '../services/pulseiqService'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize user from localStorage on mount
  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedUser = authService.getCurrentUser()
      if (!storedUser) {
        setLoading(false)
        return
      }

      setUser(storedUser)

      try {
        const freshUser = await authService.getProfile()
        setUser(freshUser)
      } catch {
        authService.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const userData = await authService.login(email, password)
      setUser(userData)
      pulseiqService.identify(userData._id, {
        email: userData.email,
        username: userData.username,
      })
      return userData
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)
      const userData = await authService.register(name, email, password)
      setUser(userData)
      pulseiqService.identify(userData._id, {
        email: userData.email,
        username: userData.username,
      })
      return userData
    } catch (err) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setError(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const userData = await authService.getProfile()
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message || 'Failed to refresh profile')
      throw err
    }
  }, [])

  const updateProfile = useCallback(async (payload) => {
    try {
      setError(null)
      const userData = await authService.updateProfile(payload)
      setUser(userData)
      pulseiqService.track('profile_save_clicked', userData._id, {
        targetRole: userData.profile?.targetRole,
        experienceLevel: userData.profile?.experienceLevel,
      })
      return userData
    } catch (err) {
      setError(err.message || 'Failed to update profile')
      throw err
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
