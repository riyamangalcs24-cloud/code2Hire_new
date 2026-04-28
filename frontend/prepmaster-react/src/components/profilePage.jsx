import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useAuth } from '../hooks/useAuth'
import { pulseiqService } from '../services/pulseiqService'

const createFormState = (user) => ({
  name: user?.name || '',
  headline: user?.profile?.headline || '',
  bio: user?.profile?.bio || '',
  location: user?.profile?.location || '',
  targetRole: user?.profile?.targetRole || '',
  experienceLevel: user?.profile?.experienceLevel || '',
  skills: (user?.profile?.skills || []).join(', '),
})

function ProfilePage() {
  const { user, isAuthenticated, refreshProfile, updateProfile } = useAuth()
  const [formData, setFormData] = useState(createFormState(user))
  const [status, setStatus] = useState({ type: '', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormData(createFormState(user))
  }, [user])

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile().catch(() => {})
    }
  }, [isAuthenticated, refreshProfile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setStatus({ type: '', message: '' })
    pulseiqService.track('form_submit', user?._id || null, {
      form: 'profile_update',
    })

    try {
      await updateProfile({
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      })
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-hero compact">
          <span className="cs-section-badge">
            <i className="fa-solid fa-id-badge"></i> My Profile
          </span>
          <h1 className="page-title">Your interview identity, synced from the database.</h1>
          <p className="page-subtitle">
            Update your public prep profile, headline, target role, and skills. Email and username stay locked after signup.
          </p>
        </section>

        {!isAuthenticated && (
          <section className="empty-state-card">
            <h2>Please sign in first</h2>
            <p>Your profile is available only after authentication.</p>
          </section>
        )}

        {isAuthenticated && (
          <section className="profile-layout">
            <aside className="profile-summary-card">
              <div className="profile-avatar">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <h2>{user?.name}</h2>
              <p>{user?.profile?.headline}</p>
              <div className="profile-pill-list">
                <span className="profile-pill">
                  <i className="fa-solid fa-at"></i> {user?.username}
                </span>
                <span className="profile-pill">
                  <i className="fa-solid fa-envelope"></i> {user?.email}
                </span>
                <span className="profile-pill">
                  <i className="fa-solid fa-bullseye"></i> {user?.profile?.targetRole}
                </span>
              </div>
            </aside>

            <form className="profile-form-card" onSubmit={handleSubmit}>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Full Name</span>
                  <input name="name" value={formData.name} onChange={handleChange} required />
                </label>

                <label className="profile-field">
                  <span>Username</span>
                  <input value={user?.username || ''} disabled readOnly />
                  <small>Auto-generated at signup and cannot be changed.</small>
                </label>

                <label className="profile-field">
                  <span>Email</span>
                  <input value={user?.email || ''} disabled readOnly />
                  <small>Email editing is disabled for account safety.</small>
                </label>

                <label className="profile-field">
                  <span>Location</span>
                  <input name="location" value={formData.location} onChange={handleChange} placeholder="Delhi, India" />
                </label>

                <label className="profile-field profile-field-wide">
                  <span>Headline</span>
                  <input name="headline" value={formData.headline} onChange={handleChange} placeholder="Focused on frontend and interview prep." />
                </label>

                <label className="profile-field">
                  <span>Target Role</span>
                  <input name="targetRole" value={formData.targetRole} onChange={handleChange} placeholder="Frontend Developer" />
                </label>

                <label className="profile-field">
                  <span>Experience Level</span>
                  <input name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="Student / Fresher" />
                </label>

                <label className="profile-field profile-field-wide">
                  <span>Skills</span>
                  <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, DSA, SQL" />
                  <small>Separate skills with commas.</small>
                </label>

                <label className="profile-field profile-field-wide">
                  <span>Bio</span>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="5" placeholder="Tell recruiters and mentors about your focus." />
                </label>
              </div>

              {status.message && <div className={`form-status ${status.type}`}>{status.message}</div>}

              <div className="profile-form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </>
  )
}

export default ProfilePage