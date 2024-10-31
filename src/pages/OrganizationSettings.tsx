import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Users, UserPlus, Mail, Building, Trash2, PencilLine, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import config from '../config';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Organization {
  id: number;
  name: string;
  members: TeamMember[];
}

const OrganizationSettings = () => {
  const { t } = useTranslation();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/organizations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('获取组织信息失败');
      }

      const data = await response.json();
      setOrganization(data);
      setNewName(data.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取组织信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOrgNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/organizations`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        throw new Error('更新组织名称失败');
      }

      setOrganization(prev => prev ? { ...prev, name: newName } : null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/organizations/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole
        })
      });

      if (!response.ok) {
        throw new Error('邀请成员失败');
      }

      await fetchOrganizationData();
      setNewMemberEmail('');
      setNewMemberRole('member');
    } catch (err) {
      setError(err instanceof Error ? err.message : '邀请失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/organizations/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('删除成员失败');
      }

      await fetchOrganizationData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败，请重试');
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

  if (!organization) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">无法加载组织信息</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">组织设置</h1>

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

        {/* Organization Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">组织信息</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <form onSubmit={handleOrgNameSubmit} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                      保存
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="text-lg font-medium text-gray-900">{organization.name}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilLine className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">团队成员</h2>
            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              {organization.members.length} 名成员
            </span>
          </div>

          {/* Invite Member Form */}
          <form onSubmit={handleInviteMember} className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  邮箱地址
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="输入邮箱地址邀请成员"
                    required
                  />
                </div>
              </div>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="member">成员</option>
                <option value="admin">管理员</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                邀请
              </button>
            </div>
          </form>

          {/* Members List */}
          <ul className="divide-y divide-gray-200">
            {organization.members.map((member) => (
              <li key={member.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {member.name ? member.name[0].toUpperCase() : member.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name || member.email}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {member.role === 'admin' ? '管理员' : '成员'}
                  </span>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-red-800 mb-4">危险操作</h2>
          <div className="space-y-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              删除组织
            </button>
            <p className="text-sm text-red-600">
              删除组织将永久删除所有相关数据，此操作无法撤销。
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizationSettings;