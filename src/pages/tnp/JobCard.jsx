export default function JobCard({ job, setJobs }) {
  const toggleStatus = () => {
    setJobs(prev =>
      prev.map(j =>
        j.id === job.id
          ? { ...j, status: j.status === "active" ? "completed" : "active" }
          : j
      )
    )
  }

  const remove = () => {
    if (!window.confirm(`Remove the ${job.companyName} drive?`)) return
    setJobs(prev => prev.filter(j => j.id !== job.id))
  }

  const placed = job.placedStudents ?? []

  return (
    <div className={`job-card ${job.status}`}>
      <div className="job-card-header">
        <div>
          <h3>{job.companyName}</h3>
          {job.companyInfo && <p className="muted">{job.companyInfo}</p>}
        </div>
        <span className={`job-status ${job.status}`}>{job.status}</span>
      </div>

      <p className="job-role">{job.jd}</p>
      {job.requirements && <p className="job-req">🛠 {job.requirements}</p>}
      {job.postedBy && <p className="job-posted">Posted by {job.postedBy}</p>}

      {job.status === "completed" && (
        <div className="placed-section">
          <h4>Placed students ({placed.length})</h4>
          {placed.length === 0 ? (
            <p className="muted">No placements recorded yet.</p>
          ) : (
            placed.map((s, i) => (
              <div key={i} className="placed-row">
                <span className="placed-name">{s.name}</span>
                <span className="placed-package">{s.package}</span>
                {s.experience && <p className="placed-exp">“{s.experience}”</p>}
              </div>
            ))
          )}
        </div>
      )}

      <div className="job-actions">
        <button className="btn-ghost" onClick={toggleStatus}>
          Mark {job.status === "active" ? "completed" : "active"}
        </button>
        <button className="btn-ghost danger" onClick={remove}>Remove</button>
      </div>
    </div>
  )
}
