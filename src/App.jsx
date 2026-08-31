import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import ScriptsList from './pages/ScriptsList'
import ScriptEditor from './pages/ScriptEditor'
import Teleprompter from './pages/Teleprompter'

// HashRouter is used (URLs like /#/scripts) so the app works on GitHub Pages
// without needing a server-side rewrite rule for client-side routes.
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/scripts"
            element={
              <PrivateRoute>
                <ScriptsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/scripts/new"
            element={
              <PrivateRoute>
                <ScriptEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/scripts/:id/edit"
            element={
              <PrivateRoute>
                <ScriptEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/prompter/:id"
            element={
              <PrivateRoute>
                <Teleprompter />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/scripts" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
