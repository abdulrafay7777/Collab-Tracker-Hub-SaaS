import React from 'react';
import { BarChart3, TrendingUp, Activity, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Analytics & Reports Page (CEO Only)
 * 
 * CONCEPT: Business Intelligence Dashboard
 * 
 * Shows:
 * 1. Key metrics and trends
 * 2. Charts and visualizations (mock data)
 * 3. Period-over-period comparisons
 * 4. Department performance
 * 5. Report generation options
 */

const Analytics = () => {
  const analyticsData = [
    {
      title: 'Total Productivity',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      period: 'vs last month',
      icon: BarChart3,
      color: 'from-blue-600 to-blue-400'
    },
    {
      title: 'Team Performance',
      value: '92%',
      change: '+2.1%',
      trend: 'up',
      period: 'vs last month',
      icon: TrendingUp,
      color: 'from-green-600 to-green-400'
    },
    {
      title: 'Task Completion Rate',
      value: '94%',
      change: '-1.3%',
      trend: 'down',
      period: 'vs last month',
      icon: Activity,
      color: 'from-purple-600 to-purple-400'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5.0',
      change: '+0.3',
      trend: 'up',
      period: 'vs last month',
      icon: BarChart3,
      color: 'from-orange-600 to-orange-400'
    }
  ];

  const departmentData = [
    { name: 'Engineering', efficiency: 92, tasks: 234, people: 45 },
    { name: 'Marketing', efficiency: 87, tasks: 156, people: 28 },
    { name: 'Product', efficiency: 89, tasks: 178, people: 32 },
    { name: 'Sales', efficiency: 91, tasks: 210, people: 38 }
  ];

  const monthlyTrend = [
    { month: 'Jan', value: 78 },
    { month: 'Feb', value: 82 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 83 },
    { month: 'May', value: 87 },
    { month: 'Jun', value: 92 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Analytics & Reports</h1>
        <p className="text-gray-400">Comprehensive business intelligence and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          const TrendIcon = item.trend === 'up' ? FiArrowUp : FiArrowDown;
          return (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase">{item.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon className={item.trend === 'up' ? 'text-green-400' : 'text-red-400'} />
                <span className={item.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                  {item.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">{item.period}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Productivity Trend</h2>
          <div className="space-y-4">
            {monthlyTrend.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{item.month}</span>
                  <span className="text-sm font-semibold text-white">{item.value}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Department Performance</h2>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{dept.name}</p>
                    <p className="text-xs text-gray-400">{dept.people} team members</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">{dept.efficiency}%</p>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                    style={{ width: `${dept.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-blue-400/30 bg-blue-600/20 rounded-lg hover:border-blue-400/60 transition-colors text-left">
            <p className="text-sm font-semibold text-blue-400">Performance Report</p>
            <p className="text-xs text-gray-400 mt-1">Quarterly performance metrics</p>
          </button>
          <button className="p-4 border border-green-400/30 bg-green-600/20 rounded-lg hover:border-green-400/60 transition-colors text-left">
            <p className="text-sm font-semibold text-green-400">Team Analytics</p>
            <p className="text-xs text-gray-400 mt-1">Team productivity analysis</p>
          </button>
          <button className="p-4 border border-purple-400/30 bg-purple-600/20 rounded-lg hover:border-purple-400/60 transition-colors text-left">
            <p className="text-sm font-semibold text-purple-400">Financial Summary</p>
            <p className="text-xs text-gray-400 mt-1">Budget and spending overview</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
