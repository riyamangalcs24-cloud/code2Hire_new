import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Roadmap from './components/Roadmap'
import ProgressHeatmap from './components/ProgressHeatmap'
import TopicDetail from './components/TopicDetail'
import ProfilePage from './components/ProfilePage'
import LandingPage from './components/LandingPage'
import SplashScreen from './components/SplashScreen'
import PulseIQRouteTracker from './components/PulseIQRouteTracker'
import './App.css'

import { domainService } from './services/domainService'
import DomainSection from './components/DomainSection'
import { useAuth } from './hooks/useAuth'

function AppContent() {
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setDomains([])
      setLoading(false)
      return
    }

    const fetchDomains = async () => {
      try {
        const data = await domainService.getDomains()
        setDomains(data)
      } catch (err) {
        setError(err.message || 'Failed to load domains')
      } finally {
        setLoading(false)
      }
    }

    fetchDomains()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <>
        <Navbar publicOnly />
        <LandingPage />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        {loading && <div className="loading-message">Loading domains...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && domains.length === 0 && (
          <div className="info-message">No domains are available at the moment.</div>
        )}
        {!loading && !error && domains.map((domain) => (
          <DomainSection key={domain.id} domain={domain} />
        ))}
        <ProgressHeatmap />
      </main>
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <>
        <Navbar publicOnly />
        <main className="page-shell">
          <div className="loading-message">Loading your workspace...</div>
        </main>
      </>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false)
    }, 1550)

    return () => window.clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <Router>
      <PulseIQRouteTracker />
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/roadmap" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main>
                <Roadmap />
              </main>
            </>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/topic/:domainId/:categoryId/:topicId" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App