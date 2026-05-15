import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

const ManagerReports = () => {
  const { showError, showSuccess } = useToast();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/workspace/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (reportId, reportTitle) => {
    showSuccess(`Downloading ${reportTitle}...`);
    // In a real app, this would trigger a download
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
          <p className="text-gray-400">Generate and view team reports</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  const reportsList = reports?.reports || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
        <p className="text-gray-400">Generate and view team reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-linear-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Reports Generated</p>
          <p className="text-3xl font-bold text-blue-400">{reports?.reportsGenerated || 0}</p>
        </div>
        <div className="bg-linear-to-br from-green-600/20 to-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Last Generated</p>
          <p className="text-lg font-bold text-green-400">{reports?.lastGenerated || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reportsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No reports available</p>
          </div>
        ) : (
          reportsList.map((report) => (
            <div key={report._id} className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4 flex items-start justify-between hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{report.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs">
                      {report.type}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(report._id, report.title)}
                className="p-2 text-emerald-400 hover:bg-emerald-400/20 rounded transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerReports;
