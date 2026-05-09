import React from 'react';
import { Cpu, HardDrive, Wifi, Zap, AlertTriangle } from 'lucide-react';

/**
 * System Performance Page (CEO Only)
 * 
 * CONCEPT: Infrastructure & Health Monitoring
 * 
 * Displays:
 * 1. Server resource utilization (CPU, Memory, Disk)
 * 2. Network performance metrics
 * 3. Database health indicators
 * 4. System alerts and warnings
 * 5. Uptime tracking
 */

const SystemPerformance = () => {
  const servers = [
    {
      name: 'API Server 1',
      cpu: 45,
      memory: 62,
      disk: 38,
      status: 'healthy',
      uptime: '99.95%'
    },
    {
      name: 'API Server 2',
      cpu: 38,
      memory: 55,
      disk: 42,
      status: 'healthy',
      uptime: '99.98%'
    },
    {
      name: 'Database Server',
      cpu: 72,
      memory: 87,
      disk: 65,
      status: 'warning',
      uptime: '99.92%'
    },
    {
      name: 'Cache Server',
      cpu: 28,
      memory: 45,
      disk: 25,
      status: 'healthy',
      uptime: '99.99%'
    }
  ];

  const networkMetrics = [
    { label: 'Bandwidth Used', value: '4.2 Gbps', max: '10 Gbps', percentage: 42 },
    { label: 'Latency', value: '12ms', max: '50ms', percentage: 24 },
    { label: 'Packet Loss', value: '0.01%', max: '1%', percentage: 1 },
    { label: 'Error Rate', value: '0.003%', max: '1%', percentage: 0.3 }
  ];

  const systemAlerts = [
    {
      id: 1,
      level: 'warning',
      title: 'High Memory Usage on DB Server',
      description: 'Database server memory usage at 87%',
      recommendation: 'Consider optimizing queries or scaling horizontally'
    },
    {
      id: 2,
      level: 'info',
      title: 'Backup Completed Successfully',
      description: 'Daily backup finished at 2:30 AM',
      recommendation: 'Next backup scheduled for tomorrow'
    },
    {
      id: 3,
      level: 'success',
      title: 'System Health Check Passed',
      description: 'All systems operational',
      recommendation: 'No action required'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-600/20 border-green-400/30';
      case 'warning': return 'bg-yellow-600/20 border-yellow-400/30';
      case 'error': return 'bg-red-600/20 border-red-400/30';
      default: return 'bg-gray-600/20 border-gray-400/30';
    }
  };

  const getAlertColor = (level) => {
    switch(level) {
      case 'warning': return 'border-yellow-400/30 bg-yellow-600/20';
      case 'error': return 'border-red-400/30 bg-red-600/20';
      case 'success': return 'border-green-400/30 bg-green-600/20';
      default: return 'border-blue-400/30 bg-blue-600/20';
    }
  };

  const getAlertTextColor = (level) => {
    switch(level) {
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">System Performance</h1>
        <p className="text-gray-400">Infrastructure health and resource monitoring</p>
      </div>

      {/* Overall System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-green-600/20 to-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">System Status</p>
          <p className="text-2xl font-bold text-green-400">Operational</p>
          <p className="text-xs text-green-400/70 mt-2">All systems healthy</p>
        </div>
        <div className="bg-linear-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Uptime</p>
          <p className="text-2xl font-bold text-blue-400">99.95%</p>
          <p className="text-xs text-blue-400/70 mt-2">30 days</p>
        </div>
        <div className="bg-linear-to-br from-purple-600/20 to-purple-400/10 border border-purple-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Response Time</p>
          <p className="text-2xl font-bold text-purple-400">89ms</p>
          <p className="text-xs text-purple-400/70 mt-2">↓ 12% improvement</p>
        </div>
        <div className="bg-linear-to-br from-orange-600/20 to-orange-400/10 border border-orange-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Active Alerts</p>
          <p className="text-2xl font-bold text-orange-400">1</p>
          <p className="text-xs text-orange-400/70 mt-2">1 warning</p>
        </div>
      </div>

      {/* Server Status */}
      <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Server Status</h2>
        <div className="space-y-4">
          {servers.map((server, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">{server.name}</h3>
                  <p className={`text-xs mt-1 ${getStatusColor(server.status)}`}>
                    {server.status.toUpperCase()}   Uptime: {server.uptime}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusBgColor(server.status)} ${getStatusColor(server.status)}`}>
                  {server.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">CPU</span>
                  </div>
                  <p className="text-lg font-bold text-white">{server.cpu}%</p>
                  <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Memory</span>
                  </div>
                  <p className="text-lg font-bold text-white">{server.memory}%</p>
                  <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-full rounded-full"
                      style={{ width: `${server.memory}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">Disk</span>
                  </div>
                  <p className="text-lg font-bold text-white">{server.disk}%</p>
                  <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            Network Performance
          </h2>
          <div className="space-y-4">
            {networkMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">{metric.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div
                      className="bg-cyan-600 h-full rounded-full"
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">{metric.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            System Alerts
          </h2>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.level)}`}>
                <p className={`text-sm font-semibold ${getAlertTextColor(alert.level)}`}>
                  {alert.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{alert.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformance;
