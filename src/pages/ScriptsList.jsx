import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeToScripts, deleteScript } from "../scripts";

export default function ScriptsList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToScripts(user.uid, (data) => {
      setScripts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this script? This can't be undone.")) return;
    await deleteScript(id);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    return timestamp.toDate().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  console.log(user);

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1>Scripts</h1>
        <div className="header-actions">
          <div className="user-details">
            {user?.photoURL && (
              <img src={user?.photoURL} className="user-profile" />
            )}
            <span className="muted">{user?.displayName}</span>
          </div>
          <button className="text-link" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
      <p className="rundown-meta">
        {loading
          ? "Loading…"
          : `${scripts.length} script${scripts.length === 1 ? "" : "s"}`}
      </p>

      <button
        className="new-script-btn"
        onClick={() => navigate("/scripts/new")}
      >
        + New script
      </button>

      {!loading && scripts.length === 0 && (
        <div className="empty-state">
          <strong>No scripts yet</strong>
          Write your first script and it'll show up here, ready to read.
        </div>
      )}

      {scripts.length > 0 && (
        <div className="rundown">
          {scripts.map((script, i) => (
            <div className="rundown-row" key={script.id}>
              <span className="rundown-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="rundown-info">
                <h3>{script.title || "Untitled script"}</h3>
                <span>Updated {formatDate(script.updatedAt)}</span>
              </div>
              <div className="rundown-actions">
                <Link className="icon-btn" to={`/prompter/${script.id}`}>
                  Read
                </Link>
                <Link className="icon-btn" to={`/scripts/${script.id}/edit`}>
                  Edit
                </Link>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(script.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
