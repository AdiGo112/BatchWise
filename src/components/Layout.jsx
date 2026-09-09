import React, { useState } from "react"
import { Routes, Route, Link } from "react-router-dom"
import { AppProvider } from "../context/AppContext"
import Navbar from "./Navbar"
import LeftSidebar from "./LeftSidebar"
import FloatingActionButton from "./FloatingActionButton"

import Home from "../pages/Home"
import PostDetail from "../pages/PostDetail"
import Communities from "../pages/Communities"
import CommunityDetail from "../pages/CommunityDetail"
import Companies from "../pages/Companies"
import CompanyDetail from "../pages/CompanyDetail"
import Resources from "../pages/Resources"
import Bookmarks from "../pages/Bookmarks"
import Search from "../pages/Search"
import ChatDefault from "../pages/ChatDefault"
import Announcements from "../pages/Announcements"
import Profile from "../pages/Profile"
import Settings from "../pages/Setting"
import CreatePost from "../pages/CreatePost"

function NotFound() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🧭</div>
      <h2>Page not found</h2>
      <p>That link doesn't lead anywhere.</p>
      <Link to="/" className="btn-primary">Back to feed</Link>
    </div>
  )
}

function Layout() {
  // The sidebar collapses on mobile; the navbar burger drives this.
  const [navOpen, setNavOpen] = useState(false)

  return (
    <AppProvider>
      <div className="app">
        <Navbar onToggleNav={() => setNavOpen(o => !o)} />

        <div className={`main-container ${navOpen ? "nav-open" : ""}`}>
          <LeftSidebar onNavigate={() => setNavOpen(false)} />

          {/* Tapping the dimmed area closes the mobile drawer. */}
          <div className="nav-scrim" onClick={() => setNavOpen(false)} />

          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/community/:id" element={<CommunityDetail />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:id" element={<CompanyDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/chats" element={<ChatDefault />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/create" element={<CreatePost />} />
              {/* These two were linked from the navbar but had no route,
                  so the menu items rendered a blank page. */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>

        <FloatingActionButton />
      </div>
    </AppProvider>
  )
}

export default Layout
