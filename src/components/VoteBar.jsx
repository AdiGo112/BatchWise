import React from 'react';
import { useApp } from '../context/AppContext';
import { compact } from '../utils';

// The upvote/downvote control, shared by the feed card and the post detail
// page. Both used to render their own copy, and in both of them the downvote
// button called toggleUpvote -- so downvoting added an upvote.
const VoteBar = ({ item, onVote, layout = 'column' }) => {
  const { currentUser, score } = useApp();

  const up = item.upvotes.includes(currentUser.id);
  const down = (item.downvotes ?? []).includes(currentUser.id);
  const locked = item.postType === 'Announcement';

  const handle = (dir) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    onVote(dir);
  };

  return (
    <div className={`vote-bar ${layout}`}>
      <button
        className={`vote-btn upvote ${up ? 'active' : ''}`}
        onClick={handle(1)}
        aria-label="Upvote"
        aria-pressed={up}
      >
        ▲
      </button>

      <div className={`vote-score ${up ? 'up' : ''} ${down ? 'down' : ''}`}>
        {compact(score(item))}
      </div>

      <button
        className={`vote-btn downvote ${down ? 'active' : ''}`}
        onClick={handle(-1)}
        disabled={locked}
        title={locked ? 'Announcements cannot be downvoted' : 'Downvote'}
        aria-label="Downvote"
        aria-pressed={down}
      >
        ▼
      </button>
    </div>
  );
};

export default VoteBar;
