"use client";

import React, { useState } from 'react';
import Header from './Header';
import KpiCard from './KpiCard';
import { Calendar, ChevronDown } from 'lucide-react';
import { getNormalizedData } from '@/data';
import './Dashboard.css';

interface DashboardProps {
  activeNav: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeNav: sidebarNav }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateFilter, setDateFilter] = useState('September');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const rawData = getNormalizedData();
  
  const data = rawData.filter(d => {
    if (dateFilter === 'September') return d.created.startsWith('2026-09');
    if (dateFilter === 'October') return d.created.startsWith('2026-10');
    if (dateFilter === 'Past 7 Days') return d.created >= '2026-10-02';
    if (dateFilter === 'Lifetime') return true;
    return true;
  });
  // Metrics Calculations
  const leads = data.length;
  const wonDeals = data.filter(d => d.stage === 'Won');
  const lostDeals = data.filter(d => d.stage === 'Lost');
  const noShows = data.filter(d => d.stage === 'No Show');
  const activeBookings = data.filter(d => d.stage === 'Call Booked');
  
  // Total booked (assuming everyone past 'Contacted' booked a call)
  const totalBooked = wonDeals.length + lostDeals.length + noShows.length + activeBookings.length;
  
  // Showed up (Won + Lost)
  const showedUp = wonDeals.length + lostDeals.length;

  const cashCollected = wonDeals.reduce((sum, deal) => sum + deal.deal_value, 0);
  const revenue = cashCollected; // Assuming same for this data
  const unitsSold = wonDeals.length;
  const aov = unitsSold > 0 ? revenue / unitsSold : 0;
  
  const sourceStats = data.reduce((acc, deal) => {
    const src = deal.source;
    if (!acc[src]) acc[src] = { leads: 0, won: 0, revenue: 0 };
    acc[src].leads += 1;
    if (deal.stage === 'Won') {
      acc[src].won += 1;
      acc[src].revenue += deal.deal_value;
    }
    return acc;
  }, {} as Record<string, { leads: number, won: number, revenue: number }>);

  const showRate = totalBooked > 0 ? (showedUp / totalBooked) * 100 : 0;
  const closeRate = showedUp > 0 ? (wonDeals.length / showedUp) * 100 : 0;
  const leadToBookingRate = leads > 0 ? (totalBooked / leads) * 100 : 0;

  // Format currency
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const generateChartData = (base: number, seedOffset: number = 0) => {
    let days = 30;
    let labelPrefix = 'Sep ';
    
    if (dateFilter === 'Past 7 Days') {
      days = 7;
      labelPrefix = 'Oct '; // Mocking current month as Oct 2026
    } else if (dateFilter === 'October') {
      days = 31;
      labelPrefix = 'Oct ';
    } else if (dateFilter === 'Lifetime') {
      days = 60; 
      labelPrefix = 'Day ';
    }

    const variations = [0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 1.0, 0.6, 0.1, 0.85, 0.45];
    return Array.from({ length: days }, (_, i) => {
      const factor = variations[(i + seedOffset) % variations.length];
      const val = base === 0 ? 0 : base * 0.7 + (base * 0.6 * factor);
      
      // Calculate display label based on timeframe
      let name = `${labelPrefix}${i + 1}`;
      if (dateFilter === 'Past 7 Days') {
         // mock past 7 days ending on Oct 9
         name = `Oct ${i + 3}`; 
      }
      
      return {
        name,
        value: val
      };
    });
  };

  const handleDateSelect = (option: string) => {
    setDateFilter(option);
    setIsDateOpen(false);
  };

  return (
    <div className="dashboard-wrapper">
      <Header />
      
      <div className="dashboard-content">
        {sidebarNav === 'Overview' && (
          <>
            <div className="filters-section">
              <div className="tabs">
                {['Overview', 'Sales', 'Financials'].map(tab => (
                  <button 
                    key={tab} 
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="date-filter" style={{ position: 'relative' }}>
                <div className="date-selector" onClick={() => setIsDateOpen(!isDateOpen)}>
                  <Calendar size={16} className="text-secondary" />
                  <span className="text-sm" style={{ minWidth: '130px' }}>{dateFilter}</span>
                  <ChevronDown size={14} className="text-secondary" style={{ transform: isDateOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                
                {isDateOpen && (
                  <div className="date-dropdown">
                    {['Past 7 Days', 'September', 'October', 'Lifetime'].map(option => (
                      <div 
                        key={option} 
                        className={`date-dropdown-item ${dateFilter === option ? 'active' : ''}`}
                        onClick={() => handleDateSelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="client-prompt">
              <span className="text-sm text-secondary">Currently viewing data for <strong className="text-primary">All Clients</strong>. Select a specific client to view detailed attribution.</span>
            </div>

            <div className="kpi-grid" style={{ animation: 'fadeIn 0.3s ease-in-out' }} key={`overview-${activeTab}`}>
            {(activeTab === 'Overview' || activeTab === 'Financials') && (
              <>
                <KpiCard 
                  title="Cash Collected" 
                  category="Financial" 
                  value={formatCurrency(cashCollected)} 
                  trend={12.5} 
                  trendText="vs previous 8 days" 
                  colorType="white"
                  chartData={generateChartData(cashCollected, 0)}
                />
                <KpiCard 
                  title="Revenue" 
                  category="Financial" 
                  value={formatCurrency(revenue)} 
                  trend={14.2} 
                  trendText="vs previous 8 days" 
                  colorType="white"
                  chartData={generateChartData(revenue, 1)}
                />
              </>
            )}

            {(activeTab === 'Overview' || activeTab === 'Sales') && (
              <>
                <KpiCard 
                  title="Avg Order Value" 
                  category="Sales" 
                  value={formatCurrency(aov)} 
                  trend={-2.4} 
                  trendText="vs previous 8 days" 
                  colorType="white"
                  chartData={generateChartData(aov, 2)}
                />
                <KpiCard 
                  title="Units Sold" 
                  category="Sales" 
                  value={unitsSold} 
                  trend={8.0} 
                  trendText="vs previous 8 days" 
                  colorType="blue"
                  chartData={generateChartData(unitsSold, 3)}
                />
              </>
            )}

            {(activeTab === 'Overview' || activeTab === 'Sales') && (
              <>
                <KpiCard 
                  title="Booked Calls" 
                  category="Pipeline" 
                  value={totalBooked} 
                  trend={21.4} 
                  trendText="vs previous 8 days" 
                  colorType="blue"
                  chartData={generateChartData(totalBooked, 4)}
                />
                <KpiCard 
                  title="Total Leads" 
                  category="Pipeline" 
                  value={leads} 
                  trend={18.2} 
                  trendText="vs previous 8 days" 
                  colorType="white"
                  chartData={generateChartData(leads, 5)}
                />
              </>
            )}

            {(activeTab === 'Overview' || activeTab === 'Sales') && (
              <>
                <KpiCard 
                  title="Show Rate" 
                  category="Conversion" 
                  value={`${showRate.toFixed(1)}%`} 
                  trend={4.5} 
                  trendText="vs previous 8 days" 
                  colorType="green"
                  chartData={generateChartData(showRate, 6)}
                />
                <KpiCard 
                  title="Close Rate" 
                  category="Conversion" 
                  value={`${closeRate.toFixed(1)}%`} 
                  trend={-1.2} 
                  trendText="vs previous 8 days" 
                  colorType="green"
                  chartData={generateChartData(closeRate, 7)}
                />
                <KpiCard 
                  title="Lead to Booking" 
                  category="Conversion" 
                  value={`${leadToBookingRate.toFixed(1)}%`} 
                  trend={6.8} 
                  trendText="vs previous 8 days" 
                  colorType="green"
                  chartData={generateChartData(leadToBookingRate, 8)}
                />
              </>
            )}
          </div>
          </>
        )}

        {sidebarNav === 'Analytics' && (
          <div className="analytics-view" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-4">Deep Analytics</h2>
            <div className="text-secondary mb-6">Detailed breakdown of traffic sources and conversion funnels.</div>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem' }}>Source</th>
                  <th style={{ padding: '1rem' }}>Leads</th>
                  <th style={{ padding: '1rem' }}>Won</th>
                  <th style={{ padding: '1rem' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sourceStats).map(([source, stats]) => (
                  <tr key={source} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }} className="text-primary">{source}</td>
                    <td style={{ padding: '1rem' }}>{stats.leads}</td>
                    <td style={{ padding: '1rem' }}>{stats.won}</td>
                    <td style={{ padding: '1rem' }} className={stats.revenue > 0 ? "text-accent-green" : "text-secondary"}>
                      {formatCurrency(stats.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sidebarNav === 'Leads' && (
          <div className="audience-view" style={{ animation: 'fadeIn 0.3s ease-in-out', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-4">Lead Directory</h2>
            <div className="text-secondary mb-6">List of all leads and their current pipeline stages.</div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {data.map((lead, i) => {
                const getStageBadgeStyles = (stage: string) => {
                  switch(stage) {
                    case 'Won': return { color: 'var(--accent-green)', bg: 'rgba(25, 214, 160, 0.1)', border: 'rgba(25, 214, 160, 0.2)' };
                    case 'Lost': return { color: '#ff6b6b', bg: 'rgba(255, 107, 107, 0.1)', border: 'rgba(255, 107, 107, 0.2)' };
                    case 'No Show': return { color: '#ff922b', bg: 'rgba(255, 146, 43, 0.1)', border: 'rgba(255, 146, 43, 0.2)' };
                    case 'Call Booked': return { color: 'var(--accent-blue)', bg: 'rgba(77, 154, 255, 0.1)', border: 'rgba(77, 154, 255, 0.2)' };
                    case 'Contacted': return { color: '#00e5ff', bg: 'rgba(0, 229, 255, 0.1)', border: 'rgba(0, 229, 255, 0.2)' };
                    case 'New Lead': return { color: 'var(--text-primary)', bg: 'var(--border)', border: 'var(--border)' };
                    default: return { color: 'var(--text-secondary)', bg: 'var(--bg-primary)', border: 'var(--border)' };
                  }
                };
                
                const styles = getStageBadgeStyles(lead.stage);

                return (
                  <div key={i} className="audience-row" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{lead.name}</div>
                        <div className="text-xs text-secondary capitalize">{lead.source.replace('_', ' ')} &middot; Rep: {lead.rep}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="text-sm font-medium" style={{ color: lead.deal_value > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {lead.deal_value > 0 ? formatCurrency(lead.deal_value) : '-'}
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, color: styles.color, backgroundColor: styles.bg, border: `1px solid ${styles.border}`, minWidth: '90px', textAlign: 'center' }}>
                        {lead.stage}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Dashboard;
