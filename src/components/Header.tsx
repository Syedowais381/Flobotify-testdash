"use client";

import React, { useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isDark, setIsDark] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiClick = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      alert("AI Assistant connected! You can now type your queries about the data.");
    }, 1000);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title-area">
          <h1 className="text-3xl font-bold">Performance Overview</h1>
          <p className="text-secondary text-sm mt-1">Track your pipeline, revenue, and conversion metrics in real-time.</p>
        </div>
        
        <div className="header-actions">
          <button className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="ai-button" onClick={handleAiClick} style={{ opacity: aiLoading ? 0.7 : 1 }}>
            <Sparkles size={16} className={aiLoading ? 'spin-animation' : ''} />
            <span>{aiLoading ? 'Connecting...' : 'Talk to my data'}</span>
          </button>
        </div>
      </div>
      <div className="header-divider"></div>
    </header>
  );
};

export default Header;
