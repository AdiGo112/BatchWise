import { useEffect, useState } from "react"

export default function AddJobModal({ setJobs, close, department, departments, postedBy }) {
  const [form, setForm] = useState({
    companyName: "",
    companyInfo: "",
    jd: "",
    requirements: "",
    department: department ?? departments?.[0] ?? ""
  })

  // Escape closes the modal; it could only be dismissed by the ✕ before.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [close])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // Was unvalidated -- Submit with every field blank added an empty job card.
  const canSubmit = form.companyName.trim() && form.jd.trim()

  const submit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setJobs(prev => [
      {
        id: Date.now(),
        ...form,
        companyName: form.companyName.trim(),
        jd: form.jd.trim(),
        status: "active",
        postedBy: postedBy ?? "TnP",
        placedStudents: []
      },
      ...prev
    ])
    close()
  }

  return (
    <div className="modal-overlay" onClick={close} role="presentation">
      <form
        className="modal-card"
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label="Add job"
      >
        <div className="modal-header">
          <h2>Add a placement drive</h2>
          <button type="button" className="modal-close" onClick={close} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <label htmlFor="j-company">Company name *</label>
          <input id="j-company" value={form.companyName} onChange={set("companyName")} autoFocus />

          <label htmlFor="j-role">Role / job description *</label>
          <input id="j-role" value={form.jd} onChange={set("jd")} placeholder="Frontend Developer" />

          <label htmlFor="j-info">About the company</label>
          <input id="j-info" value={form.companyInfo} onChange={set("companyInfo")} placeholder="Product-based MNC" />

          <label htmlFor="j-req">Requirements</label>
          <input id="j-req" value={form.requirements} onChange={set("requirements")} placeholder="React, JavaScript, DSA" />

          <label htmlFor="j-dept">Department</label>
          <select id="j-dept" value={form.department} onChange={set("department")}>
            {(departments ?? [form.department]).map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={!canSubmit}>Add drive</button>
        </div>
      </form>
    </div>
  )
}
