import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getCommunityById, posts, joinedCommunities, toggleCommunityMembership, sortPosts
  } = useApp();

  const [sort, setSort] = useState('hot');
  const community = getCommunityById(Number(id));

  const communityPosts = useMemo(
    () => (community ? sortPosts(posts.filter(p => p.communityId === community.id), sort) : []),
    [community, posts, sort, sortPosts]
  );

  if (!community) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🕳️</div>
        <h2>Community not found</h2>
        <button className="btn-primary" onClick={() => navigate('/communities')}>
          View All Communities
        </button>
      </div>
    );
  }

  const isJoined = joinedCommunities.includes(community.id);

  return (
    <div className="community-detail-page">
      <div className="community-header">
        <div className="community-info">
          <h1>{community.name}</h1>
          <p className="community-description">{community.description}</p>
          <div className="community-stats">
            <span>👥 {community.memberCount.toLocaleString()} members</span>
            <span>📝 {communityPosts.length} posts</span>
          </div>
        </div>
        <button
          className={`join-btn large ${isJoined ? 'joined' : ''}`}
          onClick={() => toggleCommunityMembership(community.id)}
        >
          {isJoined ? '✓ Joined' : 'Join Community'}
        </button>
      </div>

      <div className="community-content">
        <div className="feed-header">
          <div className="sort-tabs">
            {['hot', 'new', 'top'].map(s => (
              <button
                key={s}
                className={`sort-tab ${sort === s ? 'active' : ''}`}
                onClick={() => setSort(s)}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {/* One create-post form for the whole app, pre-filled with this
              community, instead of a second copy inlined here. */}
          <Link to={`/create?community=${community.id}`} className="btn-primary compact">
            + New Post
          </Link>
        </div>

        {communityPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍️</div>
            <h2>No posts yet</h2>
            <p>Be the first to post in {community.name}.</p>
            <Link to={`/create?community=${community.id}`} className="btn-primary">Create a post</Link>
          </div>
        ) : (
          communityPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
