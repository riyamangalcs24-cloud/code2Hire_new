import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { progressService } from '../services/progressService'

function ProgressHeatmap() {
  const [activityData, setActivityData] = useState([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savingDate, setSavingDate] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) {
        setActivityData([])
        setTotalProblems(0)
        setCurrentStreak(0)
        setMaxStreak(0)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await progressService.getProgress()
        const normalizedActivity = data.activity.map((entry) => {
          const [year, monthStr, day] = entry.date.split('-')
          const dateObj = new Date(year, parseInt(monthStr, 10) - 1, day)
          return {
            ...entry,
            displayDate: dateObj.toLocaleDateString(),
          }
        })

        setActivityData(normalizedActivity)
        setTotalProblems(data.stats.totalSolved)
        setCurrentStreak(data.stats.currentStreak)
        setMaxStreak(data.stats.bestStreak)
        window.dispatchEvent(new CustomEvent('prep_streak_updated', {
          detail: { currentStreak: data.stats.currentStreak },
        }))
      } catch (err) {
        setError(err.message || 'Failed to load progress activity')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [isAuthenticated])

  const handleCellClick = async (dateKey, currentLevel) => {
    if (!isAuthenticated) {
      setError('Please sign in to track progress from your real account data.')
      return
    }

    const newLevel = currentLevel === 4 ? 0 : currentLevel + 1

    try {
      setSavingDate(dateKey)
      setError('')
      const data = await progressService.updateProgress(dateKey, newLevel)
      const normalizedActivity = data.activity.map((entry) => {
        const [year, monthStr, day] = entry.date.split('-')
        const dateObj = new Date(year, parseInt(monthStr, 10) - 1, day)
        return {
          ...entry,
          displayDate: dateObj.toLocaleDateString(),
        }
      })

      setActivityData(normalizedActivity)
      setTotalProblems(data.stats.totalSolved)
      setCurrentStreak(data.stats.currentStreak)
      setMaxStreak(data.stats.bestStreak)
      window.dispatchEvent(new CustomEvent('prep_streak_updated', {
        detail: { currentStreak: data.stats.currentStreak },
      }))
    } catch (err) {
      setError(err.message || 'Failed to update progress activity')
    } finally {
      setSavingDate('')
    }
  }

  const monthLabels = []
  let currentMonth = -1
  for (let i = 0; i < activityData.length; i += 7) {
    const colIndex = i / 7
    const firstDayOfWeek = activityData[i]
    if (firstDayOfWeek) {
      // Create a localized date obj, avoiding tz shift issues
      const [year, monthStr, day] = firstDayOfWeek.date.split('-')
      const dateObj = new Date(year, parseInt(monthStr, 10) - 1, day)
      const month = dateObj.getMonth()
      if (month !== currentMonth) {
        monthLabels.push({ text: dateObj.toLocaleString('default', { month: 'short' }), col: colIndex })
        currentMonth = month
      }
    }
  }

  return (
    <section className="heatmap-section" id="progress">
      <div className="cs-section-header">
        <span className="cs-section-badge">
          <i className="fa-solid fa-fire-flame-curved"></i> Daily Grind
        </span>
        <h2 className="section-title">Your Progress Activity</h2>
        <p className="cs-section-desc">
          {isAuthenticated
            ? "Click any box below to log today's practice and build your streak!"
            : 'Sign in to load and save your real database-backed progress history.'}
        </p>
      </div>

      <div className="heatmap-container">
        {loading && <div className="loading-message">Loading progress activity...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="heatmap-stats">
          <div className="stat-card">
            <span className="stat-value">{totalProblems}</span>
            <span className="stat-label">Total Solved</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              <i className="fa-solid fa-fire text-orange"></i> {currentStreak}
            </span>
            <span className="stat-label">Current Streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              <i className="fa-solid fa-crown text-gold"></i> {maxStreak}
            </span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>

        <div className="heatmap-grid-scroll">
          <div className="heatmap-grid-wrapper">
            <div className="heatmap-months" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.ceil(activityData.length / 7)}, 14px)`, gap: '4px', marginBottom: '8px', width: '100%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {Array.from({ length: Math.ceil(activityData.length / 7) }).map((_, i) => {
                const label = monthLabels.find(m => m.col === i)
                return (
                  <div key={i} style={{ gridColumn: `${i + 1} / span 1`, overflow: 'visible', whiteSpace: 'nowrap' }}>
                    {label ? label.text : ''}
                  </div>
                )
              })}
            </div>
            <div className="heatmap-grid">
              {activityData.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`heatmap-cell level-${day.level} ${savingDate === day.date ? 'is-saving' : ''}`} 
                  title={`${day.displayDate}: Level ${day.level} Activity. Click to update!`}
                  onClick={() => handleCellClick(day.date, day.level)}
                ></div>
              ))}
            </div>
            
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="heatmap-cell level-0" style={{cursor: 'default'}}></div>
              <div className="heatmap-cell level-1" style={{cursor: 'default'}}></div>
              <div className="heatmap-cell level-2" style={{cursor: 'default'}}></div>
              <div className="heatmap-cell level-3" style={{cursor: 'default'}}></div>
              <div className="heatmap-cell level-4" style={{cursor: 'default'}}></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgressHeatmap