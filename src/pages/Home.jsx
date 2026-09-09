import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import { compact } from '../utils';

const SORTS = [
  { id: 'hot', label: '🔥 Hot' },
  { id: 'new', label: '🆕 New' },
  { id: 'top', label: '🏆 Top' }
];

const Home = () => {
  const {
    posts, communities, companies, currentUser,
    getUserById, sortPosts, score, announcements
  } = useApp();

  const [filterCompany, setFilterCompany] = useState('all');
  const [filterPostType, setFilterPostType] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterCommunity, setFilterCommunity] = useState('all');
  const [sort, setSort] = useState('hot');

  const visiblePosts = useMemo(() => {
    // The old version called useApp() inside this filter callback, so switching
    // to "My Batch" changed the hook count between renders and React threw
    // "Rendered more hooks than during the previous render".
    const filtered = posts.filter(post => {
      if (filterCompany !== 'all' && post.companyId !== Number(filterCompany)) return false;
      if (filterCommunity !== 'all' && post.communityId !== Number(filterCommunity)) return false;
      if (filterPostType !== 'all' && post.postType !== filterPostType) return false;

      if (filterBatch === 'my-batch') {
        // Was hardcoded to batch 2026 regardless of who was logged in.
        const author = getUserById(post.authorId);
        const sameBatch = author?.batch === currentUser.batch;
        if (!sameBatch && author?.role !== 'Faculty' && !post.isPinned) return false;
      }
      return true;
    });

    return sortPosts(filtered, sort);
  }, [posts, filterCompany, filterCommunity, filterPostType, filterBatch, sort, getUserById, currentUser.batch, sortPosts]);

  const trendingPosts = useMemo(() => {
    const threeDaysAgo = Date.now() - 3 * 864e5;
    return posts
      .filter(post => new Date(post.createdAt).getTime() > threeDaysAgo)
      .sort((a, b) => score(b) - score(a))
      .slice(0, 5);
  }, [posts, score]);

  const activeFilters =
    (filterCompany !== 'all') + (filterCommunity !== 'all') +
    (filterPostType !== 'all') + (filterBatch !== 'all');

  const resetFilters = () => {
    setFilterCompany('all');
    setFilterCommunity('all');
    setFilterPostType('all');
    setFilterBatch('all');
  };

  return (
    <div className="home-page">
      <main className="center-feed">
        <div className="feed-header">
          <div className="sort-tabs" role="tablist" aria-label="Sort posts">
            {SORTS.map(s => (
              <button
                key={s.id}
                role="tab"
                aria-selected={sort === s.id}
                className={`sort-tab ${sort === s.id ? 'active' : ''}`}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Link to="/create" className="btn-primary compact">+ New Post</Link>
        </div>

        {activeFilters > 0 && (
          <div className="active-filters">
            <span>{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>
            <button onClick={resetFilters}>Clear all</button>
          </div>
        )}

        {visiblePosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2>Nothing here</h2>
            <p>No posts match your filters.</p>
            {activeFilters > 0 && (
              <button className="btn-primary" onClick={resetFilters}>Clear filters</button>
            )}
          </div>
        ) : (
          visiblePosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </main>

      <aside className="right-sidebar">
        <div className="sidebar-card">
          <div className="card-header">
            <span className="card-icon">📢</span>
            <h3>Announcements</h3>
          </div>
          <div className="card-content">
            {announcements.slice(0, 3).map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="announcement-item">
                <div className="announcement-text">{post.title}</div>
              </Link>
            ))}
            {announcements.length === 0 && <p className="muted">No announcements yet.</p>}
          </div>
        </div>

        <div className="sidebar-card">
          <div className="card-header">
            <span className="card-icon">🔥</span>
            <h3>Trending This Week</h3>
          </div>
          <div className="card-content">
            {trendingPosts.length === 0 && <p className="muted">Nothing trending right now.</p>}
            {trendingPosts.map((post, index) => (
              <Link key={post.id} to={`/post/${post.id}`} className="trending-item">
                <span className="trending-number">{index + 1}</span>
                <span className="trending-text">{post.title}</span>
                <span className="trending-score">{compact(score(post))}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="sidebar-card">
          <div className="card-header">
            <span className="card-icon">🎛️</span>
            <h3>Filters</h3>
          </div>
          <div className="card-content">
            <div className="filter-group">
              <label>Batch</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterBatch === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterBatch('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterBatch === 'my-batch' ? 'active' : ''}`}
                  onClick={() => setFilterBatch('my-batch')}
                >
                  Batch {currentUser.batch ?? '—'}
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="f-community">Community</label>
              <select id="f-community" value={filterCommunity} onChange={e => setFilterCommunity(e.target.value)}>
                <option value="all">All Communities</option>
                {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="f-company">Company</label>
              <select id="f-company" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="all">All Companies</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="f-type">Post Type</label>
              <select id="f-type" value={filterPostType} onChange={e => setFilterPostType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Interview Experience">Interview Experience</option>
                <option value="Question">Question</option>
                <option value="Announcement">Announcement</option>
                <option value="Discussion">Discussion</option>
              </select>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;
