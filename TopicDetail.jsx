import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { domainService } from '../services/domainService'

function TopicDetail() {
  const { domainId, categoryId, topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await domainService.getTopicDetail(domainId, categoryId, topicId)
        setTopic(data)
      } catch (err) {
        setError(err.message || 'Failed to load topic detail')
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [domainId, categoryId, topicId])

  if (loading) return <><Navbar /><main className="page-shell"><div className="loading-message">Loading topic...</div></main></>
  if (error) return <><Navbar /><main className="page-shell"><div className="error-message">Error: {error}</div></main></>

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-hero">
          <span className="cs-section-badge">
            <i className="fa-solid fa-layer-group"></i> {topic.domainTitle} / {topic.categoryTitle}
          </span>
          <h1 className="page-title">{topic.title}</h1>
          <p className="page-subtitle">{topic.description}</p>
          <div className="topic-meta-row">
            <span className="profile-pill"><i className="fa-regular fa-clock"></i> {topic.estimatedDuration}</span>
            <span className="profile-pill"><i className="fa-solid fa-signal"></i> {topic.difficulty}</span>
          </div>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Overview</h2>
            {topic.overview.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </article>

          <article className="detail-card">
            <h2>Key Concepts</h2>
            <ul className="detail-list">
              {topic.keyConcepts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Interview Questions</h2>
            <div className="qa-stack">
              {topic.interviewQuestions.map((item) => (
                <div key={item.question} className="qa-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <h2>Learning Checklist</h2>
            <ul className="detail-list">
              {topic.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card">
            <h2>Practice Resources</h2>
            <div className="resource-stack">
              {topic.resources.map((resource) => (
                <div className="resource-item" key={resource.title}>
                  <strong>{resource.title}</strong>
                  <span>{resource.type}</span>
                  <p>{resource.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <div className="page-actions">
          <Link to="/" className="btn-secondary">Back to dashboard</Link>
        </div>
      </main>
    </>
  )
}

export default TopicDetail