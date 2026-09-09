import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VoteBar from './VoteBar';
import { timeAgo } from '../utils';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const {
    currentUser,
    vote,
    getUserById,
    getCommunityById,
    getCompanyById,
    toggleBookmark,
    bookmarkedPosts,
    deletePost
  } = useApp();

  const author = getUserById(post.authorId);
  const community = post.communityId ? getCommunityById(post.communityId) : null;
  const company = post.companyId ? getCompanyById(post.companyId) : null;

  const isBookmarked = bookmarkedPosts.includes(post.id);
  const isMine = post.authorId === currentUser.id;
  const commentCount = post.comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);

  const stop = (fn) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };

  const handleDelete = stop(() => {
    if (window.confirm('Delete this post?')) deletePost(post.id);
  });

  return (
    <article
      className={`post-card ${post.isPinned ? 'pinned' : ''}`}
      onClick={() => navigate(`/post/${post.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/post/${post.id}`)}
      role="link"
      tabIndex={0}
    >
      <VoteBar item={post} onVote={(dir) => vote(post.id, dir)} />

      <div className="post-content">
        <div className="post-header">
          {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}

          <span className={`post-tag ${post.postType.toLowerCase().replace(/ /g, '-')}`}>
            {post.postType}
          </span>

          {company && (
            <Link to={`/company/${company.id}`} className="company-tag" onClick={e => e.stopPropagation()}>
              {company.logo} {company.name}
            </Link>
          )}

          {community && (
            <Link to={`/community/${community.id}`} className="community-tag" onClick={e => e.stopPropagation()}>
              {community.name}
            </Link>
          )}
        </div>

        <h3 className="post-title">{post.title}</h3>

        <p className="post-preview">
          {post.content.slice(0, 200)}
          {post.content.length > 200 && '…'}
        </p>

        <div className="post-footer">
          <div className="author-info">
            {author?.avatar && <img className="avatar-xs" src={author.avatar} alt="" />}
            <span className="author-name">{author?.name ?? 'Unknown'}</span>
            <span className="author-role-badge" data-role={author?.role?.toLowerCase()}>
              {author?.role}
            </span>
            {author?.batch && <span className="author-batch">Batch {author.batch}</span>}
          </div>

          <div className="post-meta">
            <span>💬 {commentCount}</span>
            <span>{timeAgo(post.createdAt)}</span>

            <button
              className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={stop(() => toggleBookmark(post.id))}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? '🔖' : '🏷️'}
            </button>

            {isMine && (
              <button className="delete-btn" onClick={handleDelete} title="Delete post">
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
