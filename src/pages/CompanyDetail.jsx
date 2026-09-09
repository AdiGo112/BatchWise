import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCompanyById, posts, sortPosts } = useApp();
  const [activeTab, setActiveTab] = useState('interview');

  const company = getCompanyById(Number(id));

  const groups = useMemo(() => {
    if (!company) return { interview: [], discussions: [], all: [] };
    const mine = posts.filter(p => p.companyId === company.id);
    return {
      all: sortPosts(mine, 'hot'),
      interview: sortPosts(mine.filter(p => p.postType === 'Interview Experience'), 'hot'),
      // The old "Resources" tab filtered on postType === 'Resource', a type no
      // post has ever had, so it was permanently empty. Announcements are what
      // actually shows up for a company.
      announcements: sortPosts(mine.filter(p => p.postType === 'Announcement'), 'new'),
      discussions: sortPosts(
        mine.filter(p => p.postType === 'Question' || p.postType === 'Discussion'),
        'hot'
      )
    };
  }, [company, posts, sortPosts]);

  if (!company) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏢</div>
        <h2>Company not found</h2>
        <button className="btn-primary" onClick={() => navigate('/companies')}>
          View All Companies
        </button>
      </div>
    );
  }

  const TABS = [
    ['interview', 'Interview Experiences', groups.interview],
    ['discussions', 'Discussions', groups.discussions],
    ['announcements', 'Announcements', groups.announcements]
  ];

  const shown = TABS.find(([key]) => key === activeTab)?.[2] ?? [];

  return (
    <div className="company-detail-page">
      <div className="company-header card">
        <div className="company-logo-large">{company.logo}</div>
        <div className="company-info">
          <h1>{company.name}</h1>
          {/* Was company.threadCount -- a hardcoded number that never matched
              the posts actually on the page. */}
          <p className="company-stats">{groups.all.length} threads on BatchWise</p>
        </div>
        <Link to={`/create?company=${company.id}`} className="btn-primary compact">
          + Share your experience
        </Link>
      </div>

      <div className="company-tabs">
        {TABS.map(([key, label, list]) => (
          <button
            key={key}
            className={`tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label} <span className="tab-count">{list.length}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h2>Nothing here yet</h2>
          <p>No posts about {company.name} in this category.</p>
          <Link to={`/create?company=${company.id}`} className="btn-primary">Be the first</Link>
        </div>
      ) : (
        shown.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default CompanyDetail;
