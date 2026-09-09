import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  users,
  communities,
  companies,
  resources,
  initialPosts,
  getUserById,
  getCommunityById,
  getCompanyById
} from '../data/Mockdata';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Session state used to vanish on every refresh -- the README listed it as a
// known limitation. It is a two-line hook, so it is not a limitation any more.
function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota or private mode. Losing persistence is not worth crashing over.
    }
  }, [key, value]);

  return [value, setValue];
}

export const score = (item) => item.upvotes.length - (item.downvotes?.length ?? 0);

// Reddit-style hot ranking: upvotes decay against age, so a 2-hour-old post
// with 5 votes can outrank a week-old post with 20.
const hotness = (post) => {
  const ageHours = (Date.now() - new Date(post.createdAt)) / 3.6e6;
  return score(post) / Math.pow(ageHours + 2, 1.5);
};

export const sortPosts = (posts, mode) => {
  const ranked = [...posts];
  if (mode === 'new') {
    ranked.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (mode === 'top') {
    ranked.sort((a, b) => score(b) - score(a));
  } else {
    ranked.sort((a, b) => hotness(b) - hotness(a));
  }
  // Pinned posts float regardless of sort mode.
  return ranked.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
};

// Applies `fn` to the comment with `commentId`, at either nesting level.
const mapComments = (comments, commentId, fn) =>
  comments.map(comment => {
    const updated = comment.id === commentId ? fn(comment) : comment;
    return {
      ...updated,
      replies: (updated.replies ?? []).map(r => (r.id === commentId ? fn(r) : r))
    };
  });

// Toggle a vote in `dir` (1 or -1) for `userId`, clearing the opposite vote.
export const applyVote = (item, userId, dir) => {
  const up = new Set(item.upvotes);
  const down = new Set(item.downvotes ?? []);
  const target = dir === 1 ? up : down;
  const other = dir === 1 ? down : up;

  other.delete(userId);
  if (target.has(userId)) target.delete(userId);
  else target.add(userId);

  return { ...item, upvotes: [...up], downvotes: [...down] };
};

export const AppProvider = ({ children }) => {
  const { user: currentUser } = useAuth();

  // Namespaced per user so two accounts on one machine don't share bookmarks.
  const ns = `batchwise:${currentUser?.id ?? 'guest'}`;
  const [posts, setPosts] = usePersistedState(`${ns}:posts`, initialPosts);
  const [joinedCommunities, setJoinedCommunities] = usePersistedState(`${ns}:communities`, [1, 3]);
  const [bookmarkedPosts, setBookmarkedPosts] = usePersistedState(`${ns}:bookmarks`, []);
  const [readAnnouncements, setReadAnnouncements] = usePersistedState(`${ns}:read`, []);

  const userId = currentUser?.id;

  const vote = useCallback((postId, dir) => {
    setPosts(prev => prev.map(p => (p.id === postId ? applyVote(p, userId, dir) : p)));
  }, [setPosts, userId]);

  // Kept for callers that only ever upvote.
  const toggleUpvote = useCallback((postId) => vote(postId, 1), [vote]);

  const addComment = useCallback((postId, content, parentCommentId = null) => {
    const newComment = {
      id: Date.now(),
      authorId: userId,
      content,
      createdAt: new Date().toISOString(),
      upvotes: [],
      downvotes: [],
      parentCommentId,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      if (!parentCommentId) return { ...post, comments: [...post.comments, newComment] };
      // Reply: attach to its parent without mutating the existing comment
      // objects (the old version mutated them in place, so React could miss it).
      return {
        ...post,
        comments: post.comments.map(cm =>
          cm.id === parentCommentId
            ? { ...cm, replies: [...(cm.replies ?? []), newComment] }
            : cm
        )
      };
    }));
  }, [setPosts, userId]);

  const deleteComment = useCallback((postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: post.comments
          .filter(cm => cm.id !== commentId)
          .map(cm => ({ ...cm, replies: (cm.replies ?? []).filter(r => r.id !== commentId) }))
      };
    }));
  }, [setPosts]);

  const voteComment = useCallback((postId, commentId, dir) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: mapComments(post.comments, commentId, cm => applyVote(cm, userId, dir)) }
        : post
    ));
  }, [setPosts, userId]);

  const toggleCommentUpvote = useCallback(
    (postId, commentId) => voteComment(postId, commentId, 1),
    [voteComment]
  );

  const toggleCommunityMembership = useCallback((communityId) => {
    setJoinedCommunities(prev =>
      prev.includes(communityId) ? prev.filter(id => id !== communityId) : [...prev, communityId]
    );
  }, [setJoinedCommunities]);

  const createPost = useCallback((postData) => {
    const newPost = {
      id: Date.now(),
      title: postData.title,
      content: postData.content,
      authorId: userId,
      communityId: postData.communityId ? Number(postData.communityId) : null,
      companyId: postData.companyId ? Number(postData.companyId) : null,
      postType: postData.postType || 'Discussion',
      upvotes: [userId], // you implicitly upvote your own post
      downvotes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      isPinned: false
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, [setPosts, userId]);

  const deletePost = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, [setPosts]);

  const toggleBookmark = useCallback((postId) => {
    setBookmarkedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  }, [setBookmarkedPosts]);

  // Post ids from seed data are ints; ids from createPost are Date.now().
  // Compare loosely against the route param either way.
  const getPostById = useCallback(
    (id) => posts.find(post => String(post.id) === String(id)),
    [posts]
  );

  const announcements = useMemo(
    () => posts
      .filter(p => p.postType === 'Announcement')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const unreadCount = announcements.filter(a => !readAnnouncements.includes(a.id)).length;

  const markAnnouncementsRead = useCallback(() => {
    setReadAnnouncements(announcements.map(a => a.id));
  }, [announcements, setReadAnnouncements]);

  const searchAll = useCallback((query) => {
    const q = query.trim().toLowerCase();
    if (!q) return { posts: [], users: [], communities: [], companies: [], resources: [] };

    const has = (...fields) => fields.some(f => f && String(f).toLowerCase().includes(q));

    return {
      posts: posts.filter(p => has(p.title, p.content)),
      users: users.filter(u => has(u.name, u.bio, u.department)),
      communities: communities.filter(c => has(c.name, c.description)),
      companies: companies.filter(c => has(c.name)),
      resources: resources.filter(r => has(r.title, r.description, r.category))
    };
  }, [posts]);

  const value = {
    currentUser,
    users,
    communities,
    companies,
    resources,
    posts,
    joinedCommunities,
    bookmarkedPosts,
    announcements,
    unreadCount,

    getUserById,
    getCommunityById,
    getCompanyById,
    getPostById,
    score,
    sortPosts,

    vote,
    toggleUpvote,
    addComment,
    deleteComment,
    voteComment,
    toggleCommentUpvote,
    toggleCommunityMembership,
    createPost,
    deletePost,
    toggleBookmark,
    markAnnouncementsRead,
    searchAll
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
