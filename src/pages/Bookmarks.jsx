import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

const Bookmarks = () => {
  const { posts, bookmarkedPosts } = useApp();

  // Keep the order you saved them in, newest first.
  const saved = bookmarkedPosts
    .map(id => posts.find(p => p.id === id))
    .filter(Boolean)
    .reverse();

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <h1>Bookmarked Posts</h1>
        <p>{saved.length === 0 ? "Posts you've saved for later." : `${saved.length} saved`}</p>
      </div>

      {saved.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h2>No bookmarks yet</h2>
          <p>Tap the 🏷️ on any post to save it here. Bookmarks now survive a refresh.</p>
          <Link to="/" className="btn-primary">Browse the feed</Link>
        </div>
      ) : (
        <div className="bookmarks-list">
          {saved.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
