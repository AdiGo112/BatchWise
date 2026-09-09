import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TYPES = ['Discussion', 'Question', 'Interview Experience'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { communities, companies, createPost, currentUser } = useApp();

  // Pre-fill when arriving from a community or company page.
  const [form, setForm] = useState({
    title: '',
    content: '',
    postType: 'Discussion',
    communityId: params.get('community') ?? '',
    companyId: params.get('company') ?? ''
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const titleTooLong = form.title.length > 200;
  const canSubmit = form.title.trim() && form.content.trim() && !titleTooLong;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const post = createPost({ ...form, title: form.title.trim(), content: form.content.trim() });
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="create-page">
      <div className="page-header">
        <h1>Create a post</h1>
        <p>Posting as {currentUser.name} · {currentUser.role}</p>
      </div>

      <form className="create-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Post type</label>
          <div className="type-picker">
            {TYPES.map(t => (
              <button
                type="button"
                key={t}
                className={`type-chip ${form.postType === t ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, postType: t }))}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={set('title')}
            placeholder="An interesting title…"
            maxLength={220}
            autoFocus
          />
          <div className={`char-count ${titleTooLong ? 'over' : ''}`}>
            {form.title.length}/200
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Body</label>
          <textarea
            id="content"
            value={form.content}
            onChange={set('content')}
            placeholder="Share the details. Line breaks are preserved."
            rows="10"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="community">Community (optional)</label>
            <select id="community" value={form.communityId} onChange={set('communityId')}>
              <option value="">None</option>
              {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="company">Company (optional)</label>
            <select id="company" value={form.companyId} onChange={set('companyId')}>
              <option value="">None</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={!canSubmit}>Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
