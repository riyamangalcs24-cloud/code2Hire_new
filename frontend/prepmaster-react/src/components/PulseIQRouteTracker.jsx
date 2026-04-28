import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pulseiqService } from '../services/pulseiqService'
import { useAuth } from '../hooks/useAuth'

let lastTrackedPath = ''

function PulseIQRouteTracker() {
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`

    if (path === lastTrackedPath) {
      return
    }

    lastTrackedPath = path

    pulseiqService.trackPageView(user?._id || null, {
      path,
      title: document.title,
      referrer: document.referrer || undefined,
    })
  }, [location, user?._id])

  return null
}

export default PulseIQRouteTracker