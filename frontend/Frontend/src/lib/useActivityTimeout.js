import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const INACTIVITY_TIMEOUT = 10000 // 10 seconds in milliseconds

export default function useActivityTimeout() {
  const navigate = useNavigate()
  const timeoutRef = useRef(null)
  const activityListenerRef = useRef(null)

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }, [navigate])

  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only set timer if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Set new timer
      timeoutRef.current = setTimeout(() => {
        handleLogout()
      }, INACTIVITY_TIMEOUT)
    }
  }, [handleLogout])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return // Don't track if not logged in

    // Activity events to monitor
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    // Create activity listener
    activityListenerRef.current = () => {
      resetTimer()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, activityListenerRef.current, true)
    })

    // Set initial timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityListenerRef.current, true)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [resetTimer])
}
