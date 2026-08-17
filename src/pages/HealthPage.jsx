import { useEffect, useState } from 'react'
import { Button } from '../components/common/Button'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { healthService } from '../services/healthService'

function HealthPage() {
  const [status, setStatus] = useState(APP_TEXT.backendStatus.checking)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHealth = async () => {
    setIsLoading(true)
    setStatus(APP_TEXT.backendStatus.checking)

    try {
      const response = await healthService.checkHealth()
      if (response?.estado === 'ok') {
        setIsConnected(true)
        setStatus(APP_TEXT.backendStatus.connected)
        return
      }

      setIsConnected(false)
      setStatus(APP_TEXT.backendStatus.disconnected)
    } catch (error) {
      setIsConnected(false)
      setStatus(APP_TEXT.backendStatus.disconnected)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '560px',
          background: APP_COLORS.surface,
          border: `1px solid ${APP_COLORS.border}`,
          borderRadius: '18px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
          padding: '2rem',
        }}
      >
        <Title as="h1" align="center">{APP_TEXT.health.title}</Title>
        <p
          style={{
            margin: '1rem 0 1.5rem',
            color: APP_COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {APP_TEXT.health.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isConnected ? APP_COLORS.success : APP_COLORS.error,
              display: 'inline-block',
              boxShadow: isConnected
                ? '0 0 0 5px rgba(22, 163, 74, 0.15)'
                : '0 0 0 5px rgba(220, 38, 38, 0.12)',
            }}
          />
          <strong
            style={{
              fontSize: '1.1rem',
              color: isConnected ? APP_COLORS.success : APP_COLORS.error,
            }}
          >
            {status}
          </strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={fetchHealth} disabled={isLoading} variant="primary">
            {isLoading ? APP_TEXT.backendStatus.checking : APP_TEXT.buttons.retry}
          </Button>
        </div>
      </section>
    </main>
  )
}

export default HealthPage
