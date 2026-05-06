import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, BarChart3, HardDrive, AlertCircle, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

/**
 * CEO Dashboard
 * 
 * CONCEPT: Executive Overview Page
 * 
 * This is the main dashboard for CEO users. It displays:
 * 1. Key Performance Indicators (KPIs) - system-wide metrics
 * 2. Quick Links - fast navigation to key areas
 * 3. System Status - real-time monitoring
 * 4. Recent Alerts - important notifications
 * 
 * ARCHITECTURE:
 * - Uses StatCard component for KPI display
 * - Dashboard Grid layout (responsive)
 * - Color-coded status indicators
 * - Mock data for demonstration
 */

const CEODashboard = () => {
  // Mock data for KPIs
  const kpis = [
    {
      title: 'Total Users',
      value: '2,847',
      subtitle: '+124 this month',
      icon: Users,
      color: 'from-blue-600 to-blue-400',
      trend: 'up'
    },
    {
      title: 'Active Sessions',
      value: '1,324',
      subtitle: 'Real-time activity',
      icon: Activity,
      color: 'from-green-600 to-green-400',
      trend: 'up'
    },
    {
      title: 'System Performance',
      value: '98.5%',
      subtitle: 'Uptime this month',
      icon: BarChart3,
      color: 'from-purple-600 to-purple-400',
      trend: 'up'
    },
    {
      title: 'Storage Used',
      value: '2.3 TB',
      subtitle: 'of 10 TB capacity',
      icon: HardDrive,
      color: 'from-orange-600 to-orange-400',
      trend: 'up'
    },
  ];

  // Mock system alerts
  const alerts = [
    {
      id: 1,
      level: 'warning',
      title: 'High Memory Usage Detected',
      description: 'Server 3 is using 87% of available memory',
      time: '5 minutes ago'
    },
    {
      id: 2,
      level: 'info',
      title: 'Database Backup Completed',
      description: 'Daily backup finished successfully',
      time: '2 hours ago'
    },
    {
      id: 3,
      level: 'error',
      title: 'Failed Login Attempts',
      description: '12 failed attempts from IP 192.168.1.100',
      time: '30 minutes ago'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'User Management',
      description: 'Create, edit, or remove users',
      path: '/dashboards/ceo/users',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Live Activity',
      description: 'Monitor real-time system activity',
      path: '/dashboards/ceo/activity',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics and reports',
      path: '/dashboards/ceo/analytics',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'System Performance',
      description: 'Monitor system resources and health',
      path: '/dashboards/ceo/performance',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  const getAlertColor = (level) => {
    switch(level) {
      case 'error': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getAlertIcon = (level) => {
    switch(level) {
      case 'error': return <AlertCircle className="text-red-500" />;
      case 'warning': return <AlertCircle className="text-yellow-500" />;
      case 'info': return <CheckCircle2 className="text-blue-500" />;
      default: return <AlertCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Executive Dashboard</h1>
        <p className="text-gray-400">System-wide overview and control center</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-white">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-linear-to-br ${kpi.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-emerald-400">{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <p className="text-sm text-gray-400">Fast access to key management areas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorMap = {
                blue: 'from-blue-600/20 to-blue-400/10 border-blue-400/30 hover:border-blue-400/60',
                green: 'from-green-600/20 to-green-400/10 border-green-400/30 hover:border-green-400/60',
                purple: 'from-purple-600/20 to-purple-400/10 border-purple-400/30 hover:border-purple-400/60',
                orange: 'from-orange-600/20 to-orange-400/10 border-orange-400/30 hover:border-orange-400/60'
              };

              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`bg-linear-to-br ${colorMap[action.color]} border rounded-lg p-4 transition-all duration-300 group`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Alerts */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">System Alerts</h2>
            <p className="text-sm text-gray-400">Latest notifications</p>
          </div>

          <div className="space-y-3 max-h-100 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-3 space-y-1 ${getAlertColor(alert.level)}`}
              >
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.level)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Avg. Response Time</h3>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">127ms</p>
          <p className="text-xs text-emerald-400 mt-2">↓ 15% from last week</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Error Rate</h3>
            <AlertCircle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">0.02%</p>
          <p className="text-xs text-orange-400 mt-2">↑ 0.01% from last week</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Tasks Completed</h3>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">4,231</p>
          <p className="text-xs text-green-400 mt-2">↑ 12% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default CEODashboard;
