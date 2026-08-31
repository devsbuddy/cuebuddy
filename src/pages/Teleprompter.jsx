import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getScript } from '../scripts'

export default function Teleprompter() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const rafRef = useRef(null)

  const [script, setScript] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [speed, setSpeed] = useState(40) // pixels per second
  const [fontSize, setFontSize] = useState(48)
  const [mirrored, setMirrored] = useState(false)

  useEffect(() => {
    getScript(id).then(setScript)
  }, [id])

  useEffect(() => {
    if (!rolling) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    let lastTime = performance.now()
    const step = (now) => {
      const dt = (now - lastTime) / 1000
      lastTime = now
      const el = scrollRef.current
      if (el) {
        el.scrollTop += speed * dt
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          setRolling(false)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [rolling, speed])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setRolling((r) => !r)
      } else if (e.code === 'Escape') {
        navigate('/scripts')
      } else if (e.code === 'ArrowUp') {
        setSpeed((s) => Math.min(s + 5, 300))
      } else if (e.code === 'ArrowDown') {
        setSpeed((s) => Math.max(s - 5, 5))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [navigate])

  if (!script) {
    return <div className="screen-center" style={{ background: '#000' }}><p className="muted">Loading…</p></div>
  }

  return (
    <div className={`prompter${mirrored ? ' mirrored' : ''}`}>
      <div className="prompter-guide" />
      <div className="prompter-scroll" ref={scrollRef}>
        <div className="prompter-text" style={{ fontSize }}>
          {script.content || 'This script is empty.'}
        </div>
      </div>

      <div className="prompter-bar">
        <button className={rolling ? 'rolling' : ''} onClick={() => setRolling((r) => !r)}>
          {rolling ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => { setRolling(false); scrollRef.current.scrollTop = 0 }}>
          Restart
        </button>

        <div className="control-group">
          <span>Speed</span>
          <input
            type="range"
            min="5"
            max="150"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <span>Text size</span>
          <input
            type="range"
            min="24"
            max="96"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>

        <button onClick={() => setMirrored((m) => !m)}>
          {mirrored ? 'Unmirror' : 'Mirror'}
        </button>

        <span className="spacer" />
        <span>Space: play/pause · ↑↓: speed · Esc: exit</span>
        <button onClick={() => navigate('/scripts')}>Exit</button>
      </div>
    </div>
  )
}
