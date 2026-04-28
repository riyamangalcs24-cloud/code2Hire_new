import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import AuthModal from './AuthModal'
import ConfirmLogoutModal from './ConfirmLogoutModal'
import { useAuth } from '../hooks/useAuth'
import { pulseiqService } from '../services/pulseiqService'

function Navbar({ publicOnly = false }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [liveStreak, setLiveStreak] = useState(null)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const globalStreak = isAuthenticated ? (liveStreak ?? user?.progressSummary?.currentStreak ?? 0) : 0

  useEffect(() => {
    const handleStreakUpdate = (event) => {
      setLiveStreak(event.detail?.currentStreak || 0)
    }
    
    window.addEventListener('prep_streak_updated', handleStreakUpdate)
    return () => window.removeEventListener('prep_streak_updated', handleStreakUpdate)
  }, [])

  const links = ['Dashboard', 'Domains', 'Roadmap', 'Progress']

  return (
    <nav className="navbar" id="main-nav">
      <div className="logo">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <i className="fa-solid fa-code"></i><span className="gradient-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.5px' }}>code2hire</span>
        </Link>
      </div>
      <ul className="nav-links">
        {!publicOnly && links.map((link) => (
          <li key={link} className={link === 'Domains' ? 'has-dropdown' : ''}>
            <NavLink
              to={
                link === 'Dashboard' ? '/' :
                link === 'Domains' ? '/#domain-cs' :
                link === 'Roadmap' ? '/roadmap' :
                '/#progress'
              }
              className={({ isActive }) =>
                isActive || (link === 'Progress' && location.hash === '#progress') ? 'active' : ''
              }
              onClick={(e) => {
                if (link === 'Domains' || link === 'Progress') {
                  if (location.pathname !== '/') {
                    return
                  }
                }

                if (link === 'Progress' && location.pathname === '/') {
                  e.preventDefault()
                  document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' })
                  window.history.replaceState({}, '', '/#progress')
                }
              }}
            >
              {link}
              {link === 'Domains' && (
                <i className="fa-solid fa-chevron-down nav-dropdown-icon"></i>
              )}
            </NavLink>
            {link === 'Domains' && (
              <ul className="nav-dropdown">
                <li><a href="/#domain-cs"><i className="fa-solid fa-laptop-code" style={{width: '20px', marginRight: '8px', opacity: 0.8}}></i> Computer Science</a></li>
                <li><a href="/#domain-mech"><i className="fa-solid fa-gear" style={{width: '20px', marginRight: '8px', opacity: 0.8}}></i> Mechanical</a></li>
                <li><a href="/#domain-elec"><i className="fa-solid fa-bolt" style={{width: '20px', marginRight: '8px', opacity: 0.8}}></i> Electrical</a></li>
                <li><a href="/#domain-ai"><i className="fa-solid fa-microchip" style={{width: '20px', marginRight: '8px', opacity: 0.8}}></i> AI & ML</a></li>
              </ul>
            )}
          </li>
        ))}
        {!publicOnly && (
        <li>
          <div className="nav-streak" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f97316', fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', padding: '6px 12px', borderRadius: '20px', marginLeft: '10px' }} title="Current Global Streak">
            <i className="fa-solid fa-fire"></i> {globalStreak}
          </div>
        </li>
        )}
        <li>
          <ThemeToggle />
        </li>
        <li>
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                type="button"
                className="user-info user-trigger"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', fontWeight: 'bold' }}
                onClick={() => navigate('/profile')}
              >
                <i className="fa-solid fa-user"></i>
                <span>{user?.username || user?.name || user?.email}</span>
              </button>
              <button 
                className="btn-secondary-sm" 
                onClick={() => setIsLogoutModalOpen(true)}
                style={{ marginLeft: '10px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-primary-sm"
              id="signin-btn"
              onClick={() => {
                pulseiqService.track('signin_click', null, { source: 'navbar' })
                setIsAuthModalOpen(true)
              }}
            >
              Sign In
            </button>
          )}
        </li>
      </ul>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        userName={user?.name}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout()
          setIsLogoutModalOpen(false)
          navigate('/')
        }}
      />
    </nav>
  )
}

export default Navbar