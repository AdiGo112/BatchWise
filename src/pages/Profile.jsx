import React, { useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useApp } from "../context/AppContext"
import PostCard from "../components/PostCard"
import { compact } from "../utils"

// /profile shows you; /profile/:id shows anyone. The page used to read the auth
// user directly and had no route at all, so the navbar link went nowhere.
export default function Profile() {
  const { id } = useParams()
  const {
    currentUser, getUserById, posts, bookmarkedPosts, communities,
    joinedCommunities, sortPosts, score
  } = useApp()

  const user = id ? getUserById(Number(id)) : currentUser
  const isMe = user?.id === currentUser.id
  const [tab, setTab] = useState("posts")

  const userPosts = useMemo(
    () => (user ? sortPosts(posts.filter(p => p.authorId === user.id), "new") : []),
    [user, posts, sortPosts]
  )

  const savedPosts = useMemo(
    () => posts.filter(p => bookmarkedPosts.includes(p.id)),
    [posts, bookmarkedPosts]
  )

  const karma = useMemo(() => userPosts.reduce((n, p) => n + score(p), 0), [userPosts, score])

  const myCommunities = communities.filter(c => joinedCommunities.includes(c.id))

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🙈</div>
        <h2>User not found</h2>
        <Link to="/" className="btn-primary">Back to feed</Link>
      </div>
    )
  }

  const tabs = isMe
    ? [["posts", `Posts (${userPosts.length})`], ["saved", `Saved (${savedPosts.length})`], ["about", "About"]]
    : [["posts", `Posts (${userPosts.length})`], ["about", "About"]]

  return (
    <div className="profile-page">
      <div className="profile-header card">
        <img className="profile-avatar" src={user.avatar} alt="" />

        <div className="profile-identity">
          <h1>{user.name}</h1>
          <div className="profile-badges">
            <span className="author-role-badge" data-role={user.role?.toLowerCase()}>{user.role}</span>
            {user.batch && <span className="author-batch">Batch {user.batch}</span>}
            {user.department && <span className="author-batch">{user.department}</span>}
          </div>
          <p className="profile-bio">{user.bio}</p>

          <div className="profile-stats">
            <span><b>{userPosts.length}</b> posts</span>
            <span><b>{compact(karma)}</b> karma</span>
            <span><b>{compact(user.followers)}</b> followers</span>
            <span><b>{compact(user.following)}</b> following</span>
          </div>
        </div>
      </div>

      <div className="sort-tabs profile-tabs">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={`sort-tab ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        userPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍️</div>
            <h2>No posts yet</h2>
            {isMe && <Link to="/create" className="btn-primary">Write your first post</Link>}
          </div>
        ) : userPosts.map(p => <PostCard key={p.id} post={p} />)
      )}

      {tab === "saved" && (
        savedPosts.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">🔖</div><h2>Nothing saved yet</h2></div>
          : savedPosts.map(p => <PostCard key={p.id} post={p} />)
      )}

      {tab === "about" && (
        <div className="card profile-about">
          <dl>
            {user.prn && <><dt>PRN</dt><dd>{user.prn}</dd></>}
            <dt>Email</dt><dd>{user.email}</dd>
            {user.department && <><dt>Department</dt><dd>{user.department}</dd></>}
            {user.batch && <><dt>Batch</dt><dd>{user.batch}</dd></>}
            {user.company && <><dt>Currently at</dt><dd>{user.company}</dd></>}
            {user.designation && <><dt>Designation</dt><dd>{user.designation}</dd></>}
            <dt>Contributions</dt><dd>{user.contributions}</dd>
          </dl>

          {isMe && myCommunities.length > 0 && (
            <div className="profile-communities">
              <h3>Your communities</h3>
              <div className="chip-row">
                {myCommunities.map(c => (
                  <Link key={c.id} to={`/community/${c.id}`} className="chip">{c.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
