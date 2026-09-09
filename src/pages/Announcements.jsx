import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { timeAgo } from "../utils"
import "../styles/Announcements.css"

export default function Announcements() {
  // This page used to render a hardcoded array that had nothing to do with the
  // rest of the app -- new announcements never appeared, and clicking one did
  // nothing. It now reads the same posts everything else does.
  const { announcements, getUserById, markAnnouncementsRead, score } = useApp()

  useEffect(() => { markAnnouncementsRead() }, [markAnnouncementsRead])

  return (
    <div className="announcements-page">
      <div className="page-header">
        <h1>📢 Announcements</h1>
        <p>Official notices from the placement cell and faculty.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h2>Nothing announced yet</h2>
          <p>Check back later.</p>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.map(item => {
            const author = getUserById(item.authorId)
            return (
              <Link to={`/post/${item.id}`} key={item.id} className="announcement-card">
                <div className="announcement-header">
                  <h4>{item.title}</h4>
                  {item.isPinned && <span className="tag pinned">📌 Pinned</span>}
                </div>

                <p className="announcement-message">
                  {item.content.slice(0, 240)}{item.content.length > 240 && "…"}
                </p>

                <div className="announcement-footer">
                  <span className="announcement-author">{author?.name ?? "Unknown"}</span>
                  <span className="announcement-date">{timeAgo(item.createdAt)}</span>
                  <span className="announcement-stats">
                    ▲ {score(item)} · 💬 {item.comments.length}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
