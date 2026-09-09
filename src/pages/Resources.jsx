import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compact } from '../utils';

const Resources = () => {
  const { resources } = useApp();
  const [filterCategory, setFilterCategory] = useState('all');
  const [query, setQuery] = useState('');

  const categories = ['all', ...new Set(resources.map(r => r.category))];

  const q = query.trim().toLowerCase();
  const filtered = resources
    .filter(r => filterCategory === 'all' || r.category === filterCategory)
    .filter(r => !q || `${r.title} ${r.description}`.toLowerCase().includes(q))
    .sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1>Resources</h1>
        <p>Curated prep material, ranked by how useful people found it.</p>
      </div>

      <div className="resources-controls">
        <input
          className="inline-search"
          placeholder="Search resources…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="resources-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h2>No resources found</h2>
          <p>Try a different category or search term.</p>
        </div>
      ) : (
        <div className="resources-list">
          {filtered.map(resource => (
            <div key={resource.id} className="resource-card card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className="resource-category">{resource.category}</span>
              </div>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-footer">
                <span className="resource-upvotes">▲ {compact(resource.upvotes)}</span>
                {/* These used to be href="#" with an alert() saying "this is a
                    mock link". They are real links now. */}
                <a
                  href={resource.url}
                  className="resource-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open resource ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
