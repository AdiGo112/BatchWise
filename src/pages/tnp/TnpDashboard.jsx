import { useEffect, useMemo, useState } from "react"
import { jobs as seedJobs } from "../../data/Jobs"
import JobCard from "./JobCard"
import AddJobModal from "./AddJobModal"
import { useAuth } from "../../context/AuthContext.jsx"
import { useTheme } from "../../theme"
import "../../styles/Tnp.css"

const DEPARTMENTS = ["Computer Engineering", "IT Engineering", "AI & DS"]
const STORAGE_KEY = "batchwise:tnp:jobs"

export default function TnpDashboard() {
  // Jobs used to be plain useState, so every job a coordinator added vanished
  // on refresh.
  const [jobs, setJobs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : seedJobs
    } catch {
      return seedJobs
    }
  })

  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [status, setStatus] = useState("all")
  const [showAdd, setShowAdd] = useState(false)

  const { user, logout } = useAuth()
  const [theme, toggleTheme] = useTheme()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
    } catch { /* quota */ }
  }, [jobs])

  const deptJobs = useMemo(
    () => jobs.filter(j => j.department === department),
    [jobs, department]
  )

  const filteredJobs = status === "all" ? deptJobs : deptJobs.filter(j => j.status === status)

  const stats = useMemo(() => ({
    active: deptJobs.filter(j => j.status === "active").length,
    completed: deptJobs.filter(j => j.status === "completed").length,
    placed: deptJobs.reduce((n, j) => n + (j.placedStudents?.length ?? 0), 0)
  }), [deptJobs])

  return (
    <div className="tnp-shell">
      <main className="tnp-dashboard">
        <header className="tnp-header">
          <div>
            <h1>Training &amp; Placement</h1>
            <p className="muted">{user.name} · {user.designation}</p>
          </div>
          <div className="tnp-header-actions">
            <button className="btn-ghost" onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button className="btn-ghost danger" onClick={logout}>Log out</button>
          </div>
        </header>

        <div className="tnp-stats">
          <div className="tnp-stat">
            <span className="tnp-stat-value">{stats.active}</span>
            <span className="tnp-stat-label">Active drives</span>
          </div>
          <div className="tnp-stat">
            <span className="tnp-stat-value">{stats.completed}</span>
            <span className="tnp-stat-label">Completed</span>
          </div>
          <div className="tnp-stat">
            <span className="tnp-stat-value">{stats.placed}</span>
            <span className="tnp-stat-label">Students placed</span>
          </div>
        </div>

        <div className="tnp-controls">
          <select aria-label="Department" value={department} onChange={e => setDepartment(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <div className="tnp-filters">
            {["all", "active", "completed"].map(s => (
              <button
                key={s}
                className={`filter-btn ${status === s ? "active" : ""}`}
                onClick={() => setStatus(s)}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <button className="btn-primary compact" onClick={() => setShowAdd(true)}>
            + Add Job
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2>No drives here yet</h2>
            <p>No {status === "all" ? "" : status} drives for {department}.</p>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>Add the first one</button>
          </div>
        ) : (
          <div className="job-grid">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} setJobs={setJobs} />
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddJobModal
          setJobs={setJobs}
          department={department}
          departments={DEPARTMENTS}
          postedBy={user.name}
          close={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
