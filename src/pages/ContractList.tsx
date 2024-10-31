import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FileText, Plus, Search, AlertCircle } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import Pagination from '../components/Pagination';
import config from '../config';

interface Contract {
  id: number;
  title: string;
  number: string;
  status: 'active' | 'completed' | 'terminated';
  start_date: string;
  end_date: string;
  parties: string;
  risk_count: number;
  has_high_risk: boolean;
}

interface ContractResponse {
  contracts: Contract[];
  total: number;
  page: number;
  totalPages: number;
}

const ContractList = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
          status: statusFilter !== 'all' ? statusFilter : '',
          search: searchTerm
        });

        const response = await fetch(
          `${config.apiUrl}/api/contracts?${queryParams}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('获取合同列表失败');
        }

        const data: ContractResponse = await response.json();
        setContracts(data.contracts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取合同列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [currentPage, statusFilter, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'terminated':
        return '已终止';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">合同管理</h1>
          <Link
            to="/contracts/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            上传合同
          </Link>
        </div>

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

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="搜索合同..."
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
            <option value="terminated">已终止</option>
          </select>
        </div>

        {/* Contract List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无合同</h3>
              <p className="mt-1 text-sm text-gray-500">开始上传您的第一份合同吧</p>
              <div className="mt-6">
                <Link
                  to="/contracts/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  上传合同
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <li key={contract.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <p className="ml-2 text-sm font-medium text-gray-900">{contract.title}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(contract.status)}`}>
                            {getStatusText(contract.status)}
                          </span>
                          {contract.has_high_risk && (
                            <RiskBadge level="high" size="sm" />
                          )}
                          <Link
                            to={`/contracts/${contract.id}/analysis`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            查看详情
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            合同编号: {contract.number}
                          </p>
                          {contract.parties && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              签约方: {contract.parties}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>到期时间: {new Date(contract.end_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractList;