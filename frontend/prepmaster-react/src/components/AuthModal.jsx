import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../hooks/useAuth'

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { login, register } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode !== 'register')
      setError('')
    }
  }, [initialMode, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        if (!formData.identifier || !formData.password) {
          setError('Please fill in all fields')
          return
        }
        await login(formData.identifier, formData.password)
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all fields')
          return
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        await register(formData.name, formData.email, formData.password)
      }
      onClose()
      setFormData({ name: '', identifier: '', email: '', password: '', confirmPassword: '' })
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to code2hire to continue' : 'Join code2hire to start your journey'}</p>
        </div>

        {error && <div style={{ color: '#e74c3c', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="auth-note">
              Your username will be auto-generated at signup and cannot be changed later.
            </div>
          )}

          <div className="form-group">
            <label>{isLogin ? 'Username or Email' : 'Email Address'}</label>
            <div className="input-with-icon">
              <i className={isLogin ? 'fa-regular fa-user' : 'fa-regular fa-envelope'}></i>
              <input
                type={isLogin ? 'text' : 'email'}
                name={isLogin ? 'identifier' : 'email'}
                placeholder={isLogin ? 'Enter username or email' : 'john@example.com'}
                value={isLogin ? formData.identifier : formData.email}
                onChange={handleChange}
                required
                autoComplete={isLogin ? 'username' : 'email'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-shield-halved"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up with Email'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              className="switch-auth-btn"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AuthModal