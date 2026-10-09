import React from 'react';
import { Info, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import './KpiCard.css';

interface KpiCardProps {
  title: string;
  category: string;
  value: string | number;
  trend: number; // percentage change
  trendText: string;
  colorType?: 'white' | 'blue' | 'green' | 'yellow';
  chartData?: any[]; // optional chart data
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  category, 
  value, 
  trend, 
  trendText, 
  colorType = 'white',
  chartData 
}) => {
  const isPositive = trend >= 0;
  
  // Map colorType to CSS classes
  const valueColorClass = `text-${colorType === 'white' ? 'primary' : 'accent-' + colorType}`;
  
  // For the chart
  const getChartColor = () => {
    switch(colorType) {
      case 'blue': return '#4D9AFF';
      case 'green': return '#19D6A0';
      case 'yellow': return '#FFC21A';
      default: return '#F5F5F0';
    }
  };
  
  const chartColor = getChartColor();

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div className="flex-col">
          <span className="kpi-category">{category}</span>
          <div className="flex items-center gap-2">
            <h3 className="kpi-title">{title}</h3>
          </div>
        </div>
      </div>

      <div className="kpi-content">
        <div className={`kpi-value ${valueColorClass}`}>
          {value !== null && value !== undefined && value !== '' ? value : '-'}
        </div>
        
        <div className="kpi-trend-container">
          <div className={`kpi-badge ${isPositive ? 'badge-positive' : 'badge-negative'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="kpi-trend-text">{trendText}</span>
        </div>
      </div>

      {chartData && chartData.length > 0 ? (
        <div className="kpi-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill={`url(#color-${title.replace(/\s+/g, '-')})`} 
                dot={false}
                activeDot={{ r: 4, fill: chartColor, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
                labelStyle={{ display: 'none' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="kpi-chart-placeholder">
          {value === '-' ? 'Select a client to display metrics' : 'No trend data available'}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
