import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Companies = () => {
  const { companies, posts } = useApp();
  const [query, setQuery] = useState('');

  // Real counts from the posts on the platform, not the hardcoded
  // company.threadCount that claimed 234 threads for a company with two.
  const counts = useMemo(() => {
    const map = new Map();
    posts.forEach(p => p.companyId && map.set(p.companyId, (map.get(p.companyId) ?? 0) + 1));
    return map;
  }, [posts]);

  const q = query.trim().toLowerCase();
  const shown = companies
    .filter(c => !q || c.name.toLowerCase().includes(q))
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0));

  return (
    <div className="companies-page">
      <div className="page-header">
        <h1>Companies</h1>
        <p>Interview experiences and discussions, grouped by where people interviewed.</p>
      </div>

      <input
        className="inline-search"
        placeholder="Search companies…"
        aria-label="Search companies"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {shown.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h2>No companies match “{query}”</h2>
        </div>
      ) : (
        <div className="companies-grid">
          {shown.map(company => {
            const n = counts.get(company.id) ?? 0;
            return (
              <Link key={company.id} to={`/company/${company.id}`} className="company-card">
                <div className="company-logo">{company.logo}</div>
                <h3 className="company-name">{company.name}</h3>
                <p className="company-threads">
                  {n === 0 ? 'No threads yet' : `${n} thread${n === 1 ? '' : 's'}`}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Companies;
