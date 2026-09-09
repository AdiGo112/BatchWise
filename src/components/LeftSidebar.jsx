import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// NavLink gives us the active state for free -- the old sidebar hardcoded
// `className="nav-item active"` on Home, so Home looked selected everywhere.
const Item = ({ to, icon, children, onNavigate, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
  >
    <span className="nav-icon">{icon}</span>
    {children}
  </NavLink>
);

const LeftSidebar = ({ onNavigate }) => {
  const { communities, joinedCommunities } = useApp();

  // Your communities first, then the rest -- the sidebar is more useful when
  // it leads with what you actually joined.
  const sorted = [...communities].sort(
    (a, b) => joinedCommunities.includes(b.id) - joinedCommunities.includes(a.id)
  );

  return (
    <aside className="left-sidebar">
      <div className="sidebar-section">
        <Item to="/" icon="🏠" onNavigate={onNavigate} end>Home</Item>
        <Item to="/announcements" icon="📢" onNavigate={onNavigate}>Announcements</Item>
        <Item to="/chats" icon="💬" onNavigate={onNavigate}>Chats</Item>
      </div>

      <div className="sidebar-section">
        <div className="section-title">Communities</div>
        {sorted.slice(0, 5).map(community => (
          <NavLink
            key={community.id}
            to={`/community/${community.id}`}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <div className="community-info">
              <div className="community-name">{community.name}</div>
              <div className="community-members">
                {joinedCommunities.includes(community.id)
                  ? 'Joined'
                  : `${community.memberCount.toLocaleString()} members`}
              </div>
            </div>
          </NavLink>
        ))}
        <NavLink to="/communities" onClick={onNavigate} className="nav-item view-all">
          View All Communities →
        </NavLink>
      </div>

      <div className="sidebar-section">
        <Item to="/companies" icon="🏢" onNavigate={onNavigate}>Companies</Item>
        <Item to="/resources" icon="📚" onNavigate={onNavigate}>Resources</Item>
        <Item to="/bookmarks" icon="🔖" onNavigate={onNavigate}>Bookmarks</Item>
        <Item to="/profile" icon="👤" onNavigate={onNavigate} end>Profile</Item>
      </div>
    </aside>
  );
};

export default LeftSidebar;
