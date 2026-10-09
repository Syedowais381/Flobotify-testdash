"use client";

import React, { useState } from 'react';
import { Home, PieChart, Users, Settings, Search, ChevronDown, User, Activity, Bell } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav }) => {
  const [isAgencyOpen, setIsAgencyOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text font-bold text-lg">Flobotify</span>
        </div>
        
        <div className="search-container">
          <Search size={16} className="search-icon text-secondary" />
          <input type="text" placeholder="Search..." className="search-input" />
          <div className="search-shortcut text-xs text-secondary">⌘K</div>
        </div>

        <div className="agency-selector" onClick={() => setIsAgencyOpen(!isAgencyOpen)}>
          <div className="flex items-center gap-2">
            <div className="agency-avatar"></div>
            <div className="flex-col">
              <span className="text-sm font-semibold">Acme Corp</span>
              <span className="text-xs text-secondary">Client Dashboard</span>
            </div>
          </div>
          <ChevronDown size={16} className="text-secondary" style={{ transform: isAgencyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title text-xs text-secondary uppercase tracking-wider">Main</span>
          <ul>
            <li className={`nav-item ${activeNav === 'Overview' ? 'active' : ''}`} onClick={() => setActiveNav('Overview')}>
              <Home size={18} />
              <span>Overview</span>
              {activeNav === 'Overview' && <div className="active-indicator"></div>}
            </li>
            <li className={`nav-item ${activeNav === 'Analytics' ? 'active' : ''}`} onClick={() => setActiveNav('Analytics')}>
              <PieChart size={18} />
              <span>Analytics</span>
              {activeNav === 'Analytics' && <div className="active-indicator"></div>}
            </li>
            <li className={`nav-item ${activeNav === 'Leads' ? 'active' : ''}`} onClick={() => setActiveNav('Leads')}>
              <Users size={18} />
              <span>Lead Directory</span>
              {activeNav === 'Leads' && <div className="active-indicator"></div>}
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="flex-col">
            <span className="text-sm font-semibold">John Doe</span>
            <span className="text-xs text-secondary">john@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
