import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import AnalysisProgress from '../components/AnalysisProgress';
import config from '../config';

interface ContractAnalysis {
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  parties: { name: string; type: string }[];
}

const ContractUpload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const validateFile = useCallback((file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('只支持 PDF 和 Word 文档格式');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('文件大小不能超过 10MB');
    }

    return true;
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  }, []);

  const handleFileSelection = async (selectedFile: File) => {
    setError('');
    try {
      validateFile(selectedFile);
      setFile(selectedFile);
      await uploadAndAnalyze(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理失败');
      setFile(null);
    }
  };

  const uploadAndAnalyze = async (selectedFile: File) => {
    try {
      setIsUploading(true);
      setAnalysisStatus('processing');
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${config.apiUrl}/api/contracts/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '合同分析失败');
      }

      const data = await response.json();
      setAnalysisStatus('completed');

      // 自动跳转到确认页面
      navigate('/contracts/confirm', { 
        state: { 
          fileId: data.fileId,
          originalFilename: data.originalFilename,
          analysis: data.analysis
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
      setAnalysisStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">上传合同</h1>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div 
          className={`max-w-3xl p-6 border-2 border-dashed rounded-lg text-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>上传文件</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx"
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">或拖拽文件到这里</p>
              </div>
              <p className="text-xs text-gray-500">支持 PDF、Word 格式，最大 10MB</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <File className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-sm text-gray-900">{file.name}</span>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Analysis Progress */}
        {file && (
          <div className="max-w-3xl">
            <AnalysisProgress
              status={analysisStatus}
              progress={analysisProgress}
              error={error}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContractUpload;