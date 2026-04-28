import { useState } from 'react'
import AuthModal from './AuthModal'
import RippleButton from './RippleButton'
import { pulseiqService } from '../services/pulseiqService'

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openAuth = (mode) => {
    pulseiqService.track(mode === 'register' ? 'signup_click' : 'signin_click', null, {
      source: 'landing_hero',
    })
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <main className="landing-shell">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="landing-badge">
              <i className="fa-solid fa-shield-halved"></i> Members-only interview workspace
            </span>
            <h1>
              Crack interviews with a <span className="gradient-text">private prep dashboard</span>.
            </h1>
            <p>
              Sign up or sign in to unlock guided domains, detailed topic pages, progress analytics,
              roadmap tracking, and your personal profile workspace.
            </p>
            <div className="hero-actions">
              <RippleButton className="btn-primary" onClick={() => openAuth('register')}>
                Create account
              </RippleButton>
              <RippleButton className="btn-secondary" onClick={() => openAuth('login')}>
                Sign in
              </RippleButton>
            </div>
          </div>

          <div className="landing-preview-card">
            <div className="landing-preview-header">
              <span>What unlocks after login</span>
              <span className="landing-dot"></span>
            </div>
            <div className="landing-feature-list">
              <div className="landing-feature-item">
                <strong>Detailed prep pages</strong>
                <p>Topic-wise interview notes, learning checklist, and guided practice resources.</p>
              </div>
              <div className="landing-feature-item">
                <strong>Real progress sync</strong>
                <p>Your heatmap, streak, and profile stay connected to the database.</p>
              </div>
              <div className="landing-feature-item">
                <strong>Private profile workspace</strong>
                <p>Editable user profile, locked username/email rules, and account-aware navigation.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-stats-row">
          <div className="landing-stat-card">
            <span>4</span>
            <p>core interview domains</p>
          </div>
          <div className="landing-stat-card">
            <span>365</span>
            <p>days of progress history</p>
          </div>
          <div className="landing-stat-card">
            <span>100%</span>
            <p>access after sign in</p>
          </div>
        </section>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}

export default LandingPage