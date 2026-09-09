import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils';

const Comment = ({ comment, postId, level = 0 }) => {
  const {
    currentUser,
    getUserById,
    deleteComment,
    addComment,
    voteComment,
    score
  } = useApp();

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const author = getUserById(comment.authorId);
  const canDelete = comment.authorId === currentUser.id;
  const up = comment.upvotes.includes(currentUser.id);
  const down = (comment.downvotes ?? []).includes(currentUser.id);
  const replies = comment.replies ?? [];

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addComment(postId, replyText.trim(), comment.id);
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className={`comment ${level > 0 ? 'nested' : ''}`}>
      <div className="comment-content">
        <div className="comment-header">
          {author?.avatar && <img className="avatar-xs" src={author.avatar} alt="" />}
          <Link to={`/profile/${comment.authorId}`} className="comment-author">
            {author?.name ?? 'Unknown'}
          </Link>
          <span className="comment-role-badge" data-role={author?.role?.toLowerCase()}>
            {author?.role}
          </span>
          {author?.batch && <span className="comment-batch">Batch {author.batch}</span>}
          <span className="comment-timestamp">{timeAgo(comment.createdAt)}</span>

          {replies.length > 0 && (
            <button className="comment-collapse" onClick={() => setCollapsed(c => !c)}>
              {collapsed ? `[+] ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : '[−]'}
            </button>
          )}
        </div>

        {!collapsed && (
          <>
            <p className="comment-text">{comment.content}</p>

            <div className="comment-actions">
              <button
                className={`comment-vote ${up ? 'active' : ''}`}
                onClick={() => voteComment(postId, comment.id, 1)}
                aria-pressed={up}
                aria-label="Upvote comment"
              >
                ▲
              </button>
              <span className={`comment-score ${up ? 'up' : ''} ${down ? 'down' : ''}`}>
                {score(comment)}
              </span>
              <button
                className={`comment-vote ${down ? 'active' : ''}`}
                onClick={() => voteComment(postId, comment.id, -1)}
                aria-pressed={down}
                aria-label="Downvote comment"
              >
                ▼
              </button>

              {/* Replies are capped at one level, so only top-level comments
                  offer a reply box. */}
              {level === 0 && (
                <button className="comment-reply" onClick={() => setIsReplying(r => !r)}>
                  {isReplying ? 'Cancel' : 'Reply'}
                </button>
              )}

              {canDelete && (
                <button
                  className="comment-delete"
                  onClick={() => window.confirm('Delete this comment?') && deleteComment(postId, comment.id)}
                >
                  Delete
                </button>
              )}
            </div>

            {isReplying && (
              <form onSubmit={handleReply} className="reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${author?.name ?? 'this comment'}…`}
                  rows="3"
                  autoFocus
                />
                <div className="reply-form-actions">
                  <button type="submit" disabled={!replyText.trim()}>Reply</button>
                  <button type="button" onClick={() => setIsReplying(false)}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {!collapsed && replies.length > 0 && (
        <div className="comment-replies">
          {replies.map(reply => (
            <Comment key={reply.id} comment={reply} postId={postId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
