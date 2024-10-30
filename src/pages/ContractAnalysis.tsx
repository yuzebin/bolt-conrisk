import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AlertTriangle, Calendar, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

const ContractAnalysis = () => {
  const { id } = useParams();

  const contractDetails = {
    title: `示例合同 ${id}`,
    status: '进行中',
    number: `CON-2024-${String(id).padStart(4, '0')}`,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    value: '¥500,000',
    parties: ['甲方公司', '乙方公司'],
  };

  const riskAnalysis = {
    level: 'medium',
    factors: [
      { name: '付款风险', description: '付款条件较为严格，需注意按时履约' },
      { name: '违约风险', description: '违约金条款金额较高' },
      { name: '履约风险', description: '交付时间较紧，需提前规划' },
    ],
  };

  const keyDates = [
    { date: '2024-03-15', event: '首付款截止日' },
    { date: '2024-04-30', event: '中期审查' },
    { date: '2024-06-15', event: '最终交付日' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{contractDetails.title}</h1>
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            {contractDetails.status}
          </span>
        </div>

        {/* Contract Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">合同概览</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <FileText className="h-5 w-5 mr-2" />
                  合同编号
                </dt>
                <dd className="text-sm text-gray-900">{contractDetails.number}</dd>
              </div>
              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <Calendar className="h-5 w-5 mr-2" />
                  有效期
                </dt>
                <dd className="text-sm text-gray-900">
                  {contractDetails.startDate} 至 {contractDetails.endDate}
                </dd>
              </div>
              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <DollarSign className="h-5 w-5 mr-2" />
                  合同金额
                </dt>
                <dd className="text-sm text-gray-900">{contractDetails.value}</dd>
              </div>
              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <Users className="h-5 w-5 mr-2" />
                  签约方
                </dt>
                <dd className="text-sm text-gray-900">{contractDetails.parties.join(' / ')}</dd>
              </div>
            </dl>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">风险分析</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertTriangle className={`h-5 w-5 ${
                  riskAnalysis.level === 'high' ? 'text-red-500' :
                  riskAnalysis.level === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {riskAnalysis.level === 'high' ? '高风险' :
                   riskAnalysis.level === 'medium' ? '中等风险' :
                   '低风险'}
                </span>
              </div>
              <ul className="space-y-3">
                {riskAnalysis.factors.map((factor, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium text-gray-900">{factor.name}：</span>
                    <span className="text-gray-500">{factor.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Key Dates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">关键时间节点</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {keyDates.map((event, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== keyDates.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">{event.event}</p>
                        </div>
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">财务分析</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">乐观预测</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-sm font-medium text-green-700">预期收益：¥600,000</span>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  按时履约情况下，预计可获得10%的额外奖励
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">悲观预测</h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />
                  <span className="ml-2 text-sm font-medium text-red-700">最低收益：¥400,000</span>
                </div>
                <p className="mt-2 text-sm text-red-600">
                  如遇延期交付，可能面临20%的违约金
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractAnalysis;