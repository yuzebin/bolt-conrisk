import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AnalysisProgressProps {
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ status, progress = 0, error }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
        );
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return '等待分析';
      case 'processing':
        return `正在分析 (${progress}%)`;
      case 'completed':
        return '分析完成';
      case 'error':
        return '分析失败';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2 text-sm font-medium text-gray-900">
            {getStatusText()}
          </span>
        </div>
        {status === 'processing' && (
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      {error && status === 'error' && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AnalysisProgress;