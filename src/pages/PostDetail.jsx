import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Comment from '../components/Comment';
import VoteBar from '../components/VoteBar';
import { formatDate, timeAgo } from '../utils';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getPostById, getUserById, getCommunityById, getCompanyById,
    currentUser, vote, addComment, toggleBookmark, bookmarkedPosts,
    deletePost, score
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('top');

  const post = getPostById(id);

  const sortedComments = useMemo(() => {
    if (!post) return [];
    const list = [...post.comments];
    return commentSort === 'new'
      ? list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : list.sort((a, b) => score(b) - score(a));
  }, [post, commentSort, score]);

  if (!post) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👻</div>
        <h2>Post not found</h2>
        <p>It may have been deleted.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const author = getUserById(post.authorId);
  const community = post.communityId ? getCommunityById(post.communityId) : null;
  const company = post.companyId ? getCompanyById(post.companyId) : null;
  const isBookmarked = bookmarkedPosts.includes(post.id);
  const isMine = post.authorId === currentUser.id;
  const commentCount = post.comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      deletePost(post.id);
      navigate('/');
    }
  };

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <button className="back-link" onClick={() => navigate(-1)}>← Back</button>

        <div className="post-detail-card">
          <VoteBar item={post} onVote={(dir) => vote(post.id, dir)} />

          <div className="post-detail-content">
            <div className="post-detail-header">
              {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}
              <span className={`post-tag ${post.postType.toLowerCase().replace(/ /g, '-')}`}>
                {post.postType}
              </span>
              {company && (
                <Link to={`/company/${company.id}`} className="company-tag">
                  {company.logo} {company.name}
                </Link>
              )}
              {community && (
                <Link to={`/community/${community.id}`} className="community-tag">
                  {community.name}
                </Link>
              )}
            </div>

            <h1 className="post-detail-title">{post.title}</h1>

            <div className="post-detail-meta">
              {author?.avatar && <img className="avatar-xs" src={author.avatar} alt="" />}
              <Link to={`/profile/${post.authorId}`} className="author-name">
                {author?.name ?? 'Unknown'}
              </Link>
              <span className="author-role-badge" data-role={author?.role?.toLowerCase()}>
                {author?.role}
              </span>
              {author?.batch && <span className="author-batch">Batch {author.batch}</span>}
              <span className="post-timestamp" title={formatDate(post.createdAt)}>
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <div className="post-detail-body">
              {post.content.split('\n').map((paragraph, index) =>
                paragraph.trim()
                  ? <p key={index}>{paragraph}</p>
                  : <br key={index} />
              )}
            </div>

            <div className="post-detail-actions">
              <div className="action-stats">
                <span>{score(post)} points</span>
                <span>{commentCount} comments</span>
              </div>
              <div className="action-buttons">
                <button
                  className={`bookmark-action ${isBookmarked ? 'active' : ''}`}
                  onClick={() => toggleBookmark(post.id)}
                >
                  {isBookmarked ? '🔖 Bookmarked' : '🏷️ Bookmark'}
                </button>
                {isMine && (
                  <button className="danger-action" onClick={handleDelete}>🗑️ Delete</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <div className="comments-header">
            <h2>{commentCount} Comments</h2>
            <div className="sort-tabs small">
              <button
                className={`sort-tab ${commentSort === 'top' ? 'active' : ''}`}
                onClick={() => setCommentSort('top')}
              >
                Top
              </button>
              <button
                className={`sort-tab ${commentSort === 'new' ? 'active' : ''}`}
                onClick={() => setCommentSort('new')}
              >
                New
              </button>
            </div>
          </div>

          <form onSubmit={handleAddComment} className="add-comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
              rows="4"
            />
            <button type="submit" disabled={!commentText.trim()}>Add Comment</button>
          </form>

          <div className="comments-list">
            {sortedComments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              sortedComments.map(comment => (
                <Comment key={comment.id} comment={comment} postId={post.id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
