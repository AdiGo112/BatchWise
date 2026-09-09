import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../theme';

const Navbar = ({ onToggleNav }) => {
  const { user: currentUser, logout } = useAuth();
  const { announcements, unreadCount, markAnnouncementsRead } = useApp();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [openMenu, setOpenMenu] = useState(null);
  const [theme, toggleTheme] = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Dropdowns used to stay open until you clicked the same button again --
  // clicking anywhere else, or pressing Escape, now closes them.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const toggleMenu = (menu) => {
    setOpenMenu(prev => (prev === menu ? null : menu));
    if (menu === 'announcements') markAnnouncementsRead();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="burger" onClick={onToggleNav} aria-label="Toggle navigation">
            ☰
          </button>
          <Link to="/" className="logo">
            🎓 <span className="logo-text">BatchWise</span>
          </Link>
        </div>

        <div className="navbar-center">
          <form onSubmit={handleSearch} className="search-bar" role="search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search posts, people, communities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
          </form>
        </div>

        <div className="navbar-right" ref={menuRef}>
          <button
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="nav-item-wrapper">
            <button
              className="nav-icon-btn"
              onClick={() => toggleMenu('announcements')}
              aria-label={`Announcements${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={openMenu === 'announcements'}
            >
              📢
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            {openMenu === 'announcements' && (
              <div className="nav-dropdown">
                <h4>Announcements</h4>
                {announcements.slice(0, 4).map(a => (
                  <Link key={a.id} to={`/post/${a.id}`} onClick={() => setOpenMenu(null)}>
                    {a.title}
                  </Link>
                ))}
                {announcements.length === 0 && <span className="dropdown-empty">Nothing new.</span>}
                <Link to="/announcements" onClick={() => setOpenMenu(null)}>View all →</Link>
              </div>
            )}
          </div>

          <Link to="/chats" className="nav-icon-btn" aria-label="Chats">💬</Link>

          <div className="nav-item-wrapper">
            <button
              className="profile-btn"
              onClick={() => toggleMenu('profile')}
              aria-label="Account menu"
              aria-expanded={openMenu === 'profile'}
            >
              {currentUser.avatar
                ? <img src={currentUser.avatar} alt="" />
                : (currentUser.name?.[0] ?? 'U')}
            </button>
            {openMenu === 'profile' && (
              <div className="nav-dropdown">
                <div className="profile-info">
                  <strong>{currentUser.name}</strong>
                  <div>
                    {currentUser.role}
                    {currentUser.batch ? ` · Batch ${currentUser.batch}` : ''}
                  </div>
                </div>
                <Link to="/profile" onClick={() => setOpenMenu(null)}>Profile</Link>
                <Link to="/bookmarks" onClick={() => setOpenMenu(null)}>Bookmarks</Link>
                <Link to="/settings" onClick={() => setOpenMenu(null)}>Settings</Link>
                <button className="logout-btn" onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
