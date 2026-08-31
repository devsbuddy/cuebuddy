import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getScript, createScript, updateScript } from '../scripts'

export default function ScriptEditor() {
  const { id } = useParams()
  const isNew = !id
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (isNew) return
    getScript(id).then((script) => {
      if (script) {
        setTitle(script.title || '')
        setContent(script.content || '')
      }
      setLoading(false)
    })
  }, [id, isNew])

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      if (isNew) {
        const newId = await createScript(user.uid, { title, content })
        navigate(`/scripts/${newId}/edit`, { replace: true })
      } else {
        await updateScript(id, { title, content })
      }
      navigate('/scripts')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="screen-center"><p className="muted">Loading…</p></div>
  }

  return (
    <div className="editor-shell">
      <Link className="back-link" to="/scripts">&larr; Back to scripts</Link>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <input
          type="text"
          placeholder="Script title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          placeholder="Write or paste your script here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="editor-footer">
          <span className="muted">{content.trim().split(/\s+/).filter(Boolean).length} words</span>
          <button className="primary-btn" onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : 'Save script'}
          </button>
        </div>
      </div>
    </div>
  )
}
