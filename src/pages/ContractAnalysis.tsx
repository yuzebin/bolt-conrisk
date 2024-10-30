import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AlertTriangle, Calendar, DollarSign, FileText, TrendingUp, Users, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import config from '../config';
import { useTranslation } from 'react-i18next';

interface RiskAssessment {
  id: number;
  category: string;
  level: 'high' | 'medium' | 'low';
  factors: string[];
  score: number;
}

interface KeyDate {
  date: string;
  event: string;
}

interface ContractDetails {
  title: string;
  status: string;
  number: string;
  startDate: string;
  endDate: string;
  value: string;
  parties: { name: string; type: string }[];
  risks: RiskAssessment[];
  keyDates: KeyDate[];
  riskStats: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
}

const ContractAnalysis: React.FC = () => {
  const { id } = useParams();
  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.apiUrl}/api/contracts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(t('contracts.error.fetchFailed'));
        }

        const data = await response.json();
        setContract(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('contracts.error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [id, t]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contract) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error || t('contracts.error.loadFailed')}
              </h3>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      {/* Rest of the component JSX remains the same */}
    </DashboardLayout>
  );
};

export default ContractAnalysis;