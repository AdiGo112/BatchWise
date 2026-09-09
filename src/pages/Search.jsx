import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import { compact } from '../utils';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchAll } = useApp();
  const [tab, setTab] = useState('all');

  const results = useMemo(() => searchAll(query), [query, searchAll]);

  const total = Object.values(results).reduce((n, list) => n + list.length, 0);

  if (!query.trim()) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h2>Search BatchWise</h2>
        <p>Find posts, people, communities, companies and resources.</p>
      </div>
    );
  }

  const TABS = [
    ['all', 'All', total],
    ['posts', 'Posts', results.posts.length],
    ['users', 'People', results.users.length],
    ['communities', 'Communities', results.communities.length],
    ['companies', 'Companies', results.companies.length],
    ['resources', 'Resources', results.resources.length]
  ];

  const show = (key) => tab === 'all' || tab === key;

  return (
    <div className="search-page">
      <div className="page-header">
        <h1>Results for “{query}”</h1>
        <p>{total} result{total === 1 ? '' : 's'}</p>
      </div>

      <div className="sort-tabs wrap">
        {TABS.map(([key, label, count]) => (
          <button
            key={key}
            className={`sort-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
            disabled={count === 0 && key !== 'all'}
          >
            {label} <span className="tab-count">{count}</span>
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤷</div>
          <h2>No results found</h2>
          <p>Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="search-results">
          {show('posts') && results.posts.length > 0 && (
            <section className="search-section">
              <h2>Posts</h2>
              {results.posts.map(post => <PostCard key={post.id} post={post} />)}
            </section>
          )}

          {show('users') && results.users.length > 0 && (
            <section className="search-section">
              <h2>People</h2>
              <div className="users-results">
                {results.users.map(user => (
                  /* These used to be plain divs -- searching for a person gave
                     you a name you could not click. */
                  <Link key={user.id} to={`/profile/${user.id}`} className="user-result card">
                    <img className="avatar-sm" src={user.avatar} alt="" />
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-role-badge" data-role={user.role?.toLowerCase()}>
                        {user.role}
                      </span>
                      {user.batch && <span className="user-batch">Batch {user.batch}</span>}
                      <p className="muted">{user.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {show('communities') && results.communities.length > 0 && (
            <section className="search-section">
              <h2>Communities</h2>
              <div className="communities-grid">
                {results.communities.map(community => (
                  <Link key={community.id} to={`/community/${community.id}`} className="community-card">
                    <h3>{community.name}</h3>
                    <p className="community-description">{community.description}</p>
                    <span className="member-count">
                      👥 {compact(community.memberCount)} members
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {show('companies') && results.companies.length > 0 && (
            <section className="search-section">
              <h2>Companies</h2>
              <div className="companies-grid">
                {results.companies.map(company => (
                  <Link key={company.id} to={`/company/${company.id}`} className="company-card">
                    <div className="company-logo">{company.logo}</div>
                    <h3 className="company-name">{company.name}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {show('resources') && results.resources.length > 0 && (
            <section className="search-section">
              <h2>Resources</h2>
              <div className="resources-list">
                {results.resources.map(r => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card card"
                  >
                    <div className="resource-header">
                      <h3>{r.title}</h3>
                      <span className="resource-category">{r.category}</span>
                    </div>
                    <p className="resource-description">{r.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
