import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Users, UserPlus, Mail, Building, Trash2, PencilLine } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const OrganizationSettings = () => {
  const [orgName, setOrgName] = useState('示例公司');
  const [isEditing, setIsEditing] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ]);

  const handleOrgNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: Implement organization name update logic
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement member invitation logic
    console.log('Inviting member:', { email: newMemberEmail, role: newMemberRole });
    setNewMemberEmail('');
    setNewMemberRole('member');
  };

  const handleRemoveMember = (memberId: number) => {
    // TODO: Implement member removal logic
    console.log('Removing member:', memberId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">组织设置</h1>

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
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      保存
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="text-lg font-medium text-gray-900">{orgName}</span>
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
              {teamMembers.length} 名成员
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                邀请
              </button>
            </div>
          </form>

          {/* Members List */}
          <ul className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <li key={member.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={member.avatar}
                    alt={member.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
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