'use client';

import * as React from 'react';
import { Key, Globe, Cpu, Shield, Eye, EyeOff, Copy, Trash2, Edit, Plus, RefreshCw, AlertCircle, BarChart3, Clock, Users } from 'lucide-react';

export interface ApiKey {
  id: string;
  keyId: string;
  name: string;
  description?: string;
  key: string;
  maskedKey: string;
  type: 'read' | 'write' | 'admin' | 'webhook';
  status: 'active' | 'revoked' | 'expired' | 'suspended';
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  usageCount: number;
  rateLimit: number;
  ipWhitelist?: string[];
  permissions: string[];
  userId?: string;
  userName?: string;
  webhookUrl?: string;
  webhookEvents?: string[];
}

export interface ApiUsage {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  keyId: string;
  ipAddress: string;
  userAgent?: string;
}

export interface ApiStats {
  totalKeys: number;
  activeKeys: number;
  dailyRequests: number;
  errorRate: number;
  avgResponseTime: number;
  topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>;
  usageByKey: Array<{ keyId: string; name: string; requests: number }>;
}

export interface WebhookEvent {
  id: string;
  event: string;
  payload: any;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  attempts: number;
  sentAt?: Date;
  response?: string;
  error?: string;
}

export interface ApiManagementDashboardProps {
  apiKeys: ApiKey[];
  apiUsage: ApiUsage[];
  apiStats: ApiStats;
  webhookEvents: WebhookEvent[];
  onCreateKey: (data: { name: string; type: string; permissions: string[] }) => void;
  onRevokeKey: (keyId: string) => void;
  onRegenerateKey: (keyId: string) => void;
  onUpdateKey: (keyId: string, updates: Partial<ApiKey>) => void;
  onViewUsage: (keyId: string) => void;
  onTestWebhook: (keyId: string) => void;
  onRetryWebhook: (eventId: string) => void;
  onExportKeys: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function ApiManagementDashboard({
  apiKeys,
  apiUsage,
  apiStats,
  webhookEvents,
  onCreateKey,
  onRevokeKey,
  onRegenerateKey,
  onUpdateKey,
  onViewUsage,
  onTestWebhook,
  onRetryWebhook,
  onExportKeys,
  onRefresh,
  isLoading = false,
}: ApiManagementDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showKey, setShowKey] = React.useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newKeyType, setNewKeyType] = React.useState<'read' | 'write' | 'admin' | 'webhook'>('read');
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = React.useState<string | null>(null);

  const permissionOptions = {
    read: ['read:users', 'read:transactions', 'read:auctions', 'read:balances'],
    write: ['write:transactions', 'create:auctions', 'update:users', 'manage:escrow'],
    admin: ['*', 'manage:keys', 'manage:webhooks', 'system:config'],
    webhook: ['webhook:receive', 'webhook:send', 'event:subscribe'],
  };

  const filteredKeys = React.useMemo(() => {
    return apiKeys.filter(key => {
      const matchesSearch = 
        key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.keyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (key.userName && key.userName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || key.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [apiKeys, searchQuery, typeFilter, statusFilter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'write': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'webhook': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Never used';
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleCreateKey = () => {
    onCreateKey({
      name: newKeyName,
      type: newKeyType,
      permissions: Array.from(selectedPermissions),
    });
    setNewKeyName('');
    setNewKeyType('read');
    setSelectedPermissions(new Set());
    setShowCreateModal(false);
  };

  const handleCopyKey = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
    }
  };

  const togglePermission = (permission: string) => {
    const newSet = new Set(selectedPermissions);
    if (newSet.has(permission)) {
      newSet.delete(permission);
    } else {
      newSet.add(permission);
    }
    setSelectedPermissions(newSet);
  };

  const getWebhookStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'retrying': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600">Manage API keys, monitor usage, and configure webhooks</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => onExportKeys('csv')}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total API Keys</p>
              <p className="text-2xl font-bold text-gray-900">{apiStats.totalKeys}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active</span>
              <span className="font-medium text-green-600">{apiStats.activeKeys}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Requests</p>
              <p className="text-2xl font-bold text-gray-900">{apiStats.dailyRequests.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Cpu className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Error Rate</span>
              <span className={`font-medium ${apiStats.errorRate < 1 ? 'text-green-600' : apiStats.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                {apiStats.errorRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{apiStats.avgResponseTime}ms</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Endpoint</span>
              <span className="font-medium">
                {apiStats.topEndpoints[0]?.endpoint.split('/').pop() || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Webhook Events</p>
              <p className="text-2xl font-bold text-gray-900">{webhookEvents.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Globe className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Failed</span>
              <span className="font-medium text-red-600">
                {webhookEvents.filter(e => e.status === 'failed').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Create Button */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search API keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="read">Read Only</option>
              <option value="write">Write</option>
              <option value="admin">Admin</option>
              <option value="webhook">Webhook</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </button>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage & Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created & Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{key.name}</div>
                      <div className="text-sm text-gray-600">{key.keyId}</div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 p-2 rounded font-mono">
                            {showKey.has(key.id) ? key.key : key.maskedKey}
                          </code>
                          <button
                            onClick={() => {
                              const newSet = new Set(showKey);
                              if (newSet.has(key.id)) {
                                newSet.delete(key.id);
                              } else {
                                newSet.add(key.id);
                              }
                              setShowKey(newSet);
                            }}
                            className="p-1 text-gray-600 hover:text-gray-900"
                          >
                            {showKey.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(key.key, key.id)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            title="Copy to clipboard"
                          >
                            {copiedKeyId === key.id ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      {key.description && (
                        <div className="text-sm text-gray-500 mt-2">{key.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(key.type)}`}>
                        {key.type.toUpperCase()}
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </span>
                      </div>
                      {key.userName && (
                        <div className="text-xs text-gray-600">
                          User: {key.userName}
                        </div>
                      )}
                      {key.expiresAt && (
                        <div className="text-xs text-gray-600">
                          Expires: {formatDate(key.expiresAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Usage Count</span>
                        <span className="font-medium">{key.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rate Limit</span>
                        <span className="font-medium">{key.rateLimit}/min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Permissions</span>
                        <span className="font-medium">{key.permissions.length}</span>
                      </div>
                      {key.ipWhitelist && key.ipWhitelist.length > 0 && (
                        <div className="text-xs text-gray-500">
                          IP Whitelist: {key.ipWhitelist.length} IP{key.ipWhitelist.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900">
                        Created {formatDate(key.createdAt)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Last used {formatTimeAgo(key.lastUsed)}
                      </div>
                      {key.webhookUrl && (
                        <div className="text-xs text-blue-600 truncate" title={key.webhookUrl}>
                          Webhook: {key.webhookUrl.slice(0, 30)}...
                        </div>
                      )}
                      {key.webhookEvents && key.webhookEvents.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {key.webhookEvents.length} event{key.webhookEvents.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onViewUsage(key.id)}
                        className="flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        View Usage
                      </button>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onUpdateKey(key.id, { name: `${key.name} (edited)` })}
                          className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          <Edit className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => onRegenerateKey(key.id)}
                          className="flex-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          🔄
                        </button>
                      </div>
                      <button
                        onClick={() => onRevokeKey(key.id)}
                        className="flex items-center justify-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Revoke
                      </button>
                      {key.type === 'webhook' && (
                        <button
                          onClick={() => onTestWebhook(key.id)}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          Test Webhook
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKeys.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔑</div>
            <p className="text-gray-600">No API keys found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new key</p>
          </div>
        )}
      </div>

      {/* Webhook Events */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Webhook Events</h3>
        <div className="space-y-3">
          {webhookEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{event.event}</div>
                <div className="text-sm text-gray-600">
                  Attempts: {event.attempts} • {formatTimeAgo(event.sentAt)}
                </div>
                {event.error && (
                  <div className="text-xs text-red-600 mt-1 truncate" title={event.error}>
                    Error: {event.error}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWebhookStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                {event.status === 'failed' && (
                  <button
                    onClick={() => onRetryWebhook(event.id)}
                    className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}
          {webhookEvents.length === 0 && (
            <p className="text-gray-500 text-center py-4">No webhook events yet</p>
          )}
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top API Endpoints</h3>
        <div className="space-y-3">
          {apiStats.topEndpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="text-sm text-gray-900 truncate" title={endpoint.endpoint}>
                {endpoint.endpoint}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">{endpoint.count.toLocaleString()} calls</div>
                <div className="text-sm text-gray-600">{endpoint.avgTime}ms avg</div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ 
                      width: `${(endpoint.count / Math.max(...apiStats.topEndpoints.map(e => e.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Security Best Practices</h4>
            <ul className="text-sm text-yellow-700 space-y-1 mt-1">
              <li>• Never share API keys in client-side code or public repositories</li>
              <li>• Use environment variables to store sensitive keys</li>
              <li>• Regularly rotate API keys (every 90 days recommended)</li>
              <li>• Implement IP whitelisting for production keys</li>
              <li>• Monitor usage logs for suspicious activity</li>
              <li>• Use read-only keys for public integrations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Production Server, Mobile App"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Type
                </label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="read">Read Only</option>
                  <option value="write">Read & Write</option>
                  <option value="admin">Admin</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {permissionOptions[newKeyType].map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.has(permission)}
                        onChange={() => togglePermission(permission)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName || selectedPermissions.size === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Showing {filteredKeys.length} of {apiKeys.length} API keys • 
          Total requests today: {apiStats.dailyRequests.toLocaleString()} • 
          Error rate: {apiStats.errorRate.toFixed(2)}%
        </p>
        <p className="mt-1">
          For API documentation, visit: <a href="/api/docs" className="text-blue-600 hover:underline">/api/docs</a>
        </p>
      </div>
    </div>
  );
}
