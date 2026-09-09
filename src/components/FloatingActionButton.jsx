import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // These two buttons used to be console.log calls.
  const go = (path) => () => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="fab-container" ref={ref}>
      {open && (
        <div className="fab-menu">
          <button onClick={go('/create')}>📝 New Post</button>
          <button onClick={go('/resources')}>📎 Browse Resources</button>
          <button onClick={go('/communities')}>👥 Find a Community</button>
        </div>
      )}

      <button
        className={`fab-button ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Create"
        aria-expanded={open}
      >
        +
      </button>
    </div>
  );
};

export default FloatingActionButton;
