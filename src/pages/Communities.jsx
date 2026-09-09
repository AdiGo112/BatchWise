import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { compact } from '../utils';

const Communities = () => {
  const { communities, joinedCommunities, toggleCommunityMembership, posts } = useApp();
  const [query, setQuery] = useState('');
  const [onlyJoined, setOnlyJoined] = useState(false);

  const counts = useMemo(() => {
    const map = new Map();
    posts.forEach(p => p.communityId && map.set(p.communityId, (map.get(p.communityId) ?? 0) + 1));
    return map;
  }, [posts]);

  const q = query.trim().toLowerCase();
  const shown = communities
    .filter(c => !onlyJoined || joinedCommunities.includes(c.id))
    .filter(c => !q || `${c.name} ${c.description}`.toLowerCase().includes(q));

  return (
    <div className="communities-page">
      <div className="page-header">
        <h1>Communities</h1>
        <p>Join communities to connect with students who share your interests.</p>
      </div>

      <div className="resources-controls">
        <input
          className="inline-search"
          placeholder="Search communities…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="resources-filters">
          <button
            className={`filter-btn ${!onlyJoined ? 'active' : ''}`}
            onClick={() => setOnlyJoined(false)}
          >
            All
          </button>
          <button
            className={`filter-btn ${onlyJoined ? 'active' : ''}`}
            onClick={() => setOnlyJoined(true)}
          >
            Joined ({joinedCommunities.length})
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h2>Nothing to show</h2>
          <p>{onlyJoined ? "You haven't joined any communities yet." : `No communities match “${query}”.`}</p>
        </div>
      ) : (
        <div className="communities-grid">
          {shown.map(community => {
            const isJoined = joinedCommunities.includes(community.id);
            return (
              <Link key={community.id} to={`/community/${community.id}`} className="community-card">
                <div className="community-card-header">
                  <h3>{community.name}</h3>
                  <button
                    className={`join-btn ${isJoined ? 'joined' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCommunityMembership(community.id);
                    }}
                  >
                    {isJoined ? '✓ Joined' : 'Join'}
                  </button>
                </div>

                <p className="community-description">{community.description}</p>

                <div className="community-stats">
                  <span className="member-count">
                    👥 {compact(community.memberCount + (isJoined ? 1 : 0))} members
                  </span>
                  <span className="member-count">📝 {counts.get(community.id) ?? 0} posts</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Communities;
