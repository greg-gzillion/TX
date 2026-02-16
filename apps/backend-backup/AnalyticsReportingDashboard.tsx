'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingBag, Calendar, Download, Filter, RefreshCw, PieChart, LineChart, BarChart } from 'lucide-react';

export interface AnalyticsData {
  dateRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    activeUsers: number;
    averageOrderValue: number;
    conversionRate: number;
    disputeRate: number;
  };
  revenueTrend: Array<{ date: string; revenue: number; transactions: number }>;
  userGrowth: Array<{ date: string; newUsers: number; activeUsers: number }>;
  topMetals: Array<{ metal: string; weight: number; transactions: number; revenue: number }>;
  topSellers: Array<{ sellerId: string; sellerName: string; totalSales: number; rating: number }>;
  geographicData: Array<{ country: string; users: number; revenue: number }>;
  platformStats: {
    xrplVolume: number;
    coreumVolume: number;
    ethereumVolume: number;
    mobileUsers: number;
    desktopUsers: number;
  };
}

export interface ReportConfig {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  metrics: string[];
  format: 'pdf' | 'csv' | 'json';
  schedule?: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  lastGenerated?: Date;
}

export interface AnalyticsReportingDashboardProps {
  data: AnalyticsData;
  reports: ReportConfig[];
  onDateRangeChange: (start: Date, end: Date) => void;
  onGenerateReport: (config: ReportConfig) => void;
  onScheduleReport: (config: ReportConfig) => void;
  onExportData: (format: 'csv' | 'json' | 'pdf', metrics: string[]) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function AnalyticsReportingDashboard({
  data,
  reports,
  onDateRangeChange,
  onGenerateReport,
  onScheduleReport,
  onExportData,
  onRefresh,
  isLoading = false,
}: AnalyticsReportingDashboardProps) {
  const [dateRange, setDateRange] = React.useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [activeTab, setActiveTab] = React.useState<'overview' | 'revenue' | 'users' | 'metals' | 'geography'>('overview');
  const [selectedMetrics, setSelectedMetrics] = React.useState<Set<string>>(new Set([
    'revenue', 'transactions', 'users', 'aov'
  ]));
  const [customStartDate, setCustomStartDate] = React.useState<string>('');
  const [customEndDate, setCustomEndDate] = React.useState<string>('');

  const metricOptions = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'transactions', label: 'Transactions', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'aov', label: 'Average Order Value', icon: TrendingUp },
    { id: 'conversion', label: 'Conversion Rate', icon: BarChart3 },
    { id: 'disputes', label: 'Dispute Rate', icon: Filter },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return { icon: '↗️', color: 'text-green-600', text: `${change.toFixed(1)}%` };
    if (change < -5) return { icon: '↘️', color: 'text-red-600', text: `${Math.abs(change).toFixed(1)}%` };
    return { icon: '→', color: 'text-gray-600', text: `${change.toFixed(1)}%` };
  };

  const handleDateRangeChange = (range: '7d' | '30d' | '90d' | '1y' | 'custom') => {
    setDateRange(range);
    if (range !== 'custom') {
      const end = new Date();
      const start = new Date();
      switch (range) {
        case '7d': start.setDate(end.getDate() - 7); break;
        case '30d': start.setDate(end.getDate() - 30); break;
        case '90d': start.setDate(end.getDate() - 90); break;
        case '1y': start.setFullYear(end.getFullYear() - 1); break;
      }
      onDateRangeChange(start, end);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange(new Date(customStartDate), new Date(customEndDate));
    }
  };

  const toggleMetric = (metricId: string) => {
    const newSet = new Set(selectedMetrics);
    if (newSet.has(metricId)) {
      newSet.delete(metricId);
    } else {
      newSet.add(metricId);
    }
    setSelectedMetrics(newSet);
  };

  const generateQuickReport = (type: 'daily' | 'weekly' | 'monthly') => {
    const config: ReportConfig = {
      id: `quick-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Performance Report`,
      type,
      metrics: Array.from(selectedMetrics),
      format: 'pdf',
      recipients: ['admin@phoenixpme.com'],
    };
    onGenerateReport(config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600">Platform performance metrics and insights</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={() => onExportData('pdf', Array.from(selectedMetrics))}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {(['7d', '30d', '90d', '1y', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'custom' ? 'Custom Range' : `Last ${range}`}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                onClick={handleCustomDateSubmit}
                disabled={!customStartDate || !customEndDate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing data from {data.dateRange.start.toLocaleDateString()} to {data.dateRange.end.toLocaleDateString()}
        </div>
      </div>

      {/* Metrics Selector */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-3">Select Metrics</h3>
        <div className="flex flex-wrap gap-3">
          {metricOptions.map((metric) => {
            const Icon = metric.icon;
            const isSelected = selectedMetrics.has(metric.id);
            return (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transactions</span>
              <span className="font-medium">{formatNumber(data.summary.totalTransactions)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.activeUsers)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Order Value</span>
              <span className="font-medium">{formatCurrency(data.summary.averageOrderValue)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.summary.conversionRate)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dispute Rate</span>
              <span className={`font-medium ${data.summary.disputeRate < 5 ? 'text-green-600' : data.summary.disputeRate < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {formatPercentage(data.summary.disputeRate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {(['overview', 'revenue', 'users', 'metals', 'geography'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Revenue Trend */}
        {activeTab === 'overview' || activeTab === 'revenue' ? (
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {data.revenueTrend.map((day, index) => {
                const maxRevenue = Math.max(...data.revenueTrend.map(d => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {day.date.slice(5)}
                    </div>
                    <div className="text-xs font-medium mt-1">
                      {formatCurrency(day.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Period Revenue</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(data.revenueTrend.reduce((sum, day) => sum + day.revenue, 0))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Daily Revenue</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(data.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / data.revenueTrend.length)}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* User Growth */}
        {activeTab === 'overview' || activeTab === 'users' ? (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
            <div className="space-y-4">
              {data.userGrowth.map((growth, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{growth.date}</div>
                    <div className="text-sm text-gray-600">
                      {growth.newUsers} new users, {growth.activeUsers} active
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">+{growth.newUsers}</div>
                    <div className="text-sm text-gray-600">Total: {growth.activeUsers}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Top Metals */}
        {activeTab === 'overview' || activeTab === 'metals' ? (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Metals</h3>
            <div className="space-y-4">
              {data.topMetals.map((metal, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{metal.metal}</div>
                      <div className="text-sm text-gray-600">
                        {metal.weight.toFixed(2)} oz • {metal.transactions} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(metal.revenue)}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Geographic Distribution */}
        {activeTab === 'overview' || activeTab === 'geography' ? (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.geographicData.map((geo, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-900">{geo.country}</div>
                    <div className="text-sm text-gray-600">{geo.users} users</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-medium">{formatCurrency(geo.revenue)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(geo.revenue / Math.max(...data.geographicData.map(g => g.revenue))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Platform Stats */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">XRPL Volume</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(data.platformStats.xrplVolume)}
            </div>
            <div className="text-xs text-gray-500 mt-1">XRP, SOLO, USDT</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Coreum Volume</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(data.platformStats.coreumVolume)}
            </div>
            <div className="text-xs text-gray-500 mt-1">COREUM, rUSD</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Mobile Users</div>
            <div className="text-xl font-bold text-gray-900">
              {formatPercentage((data.platformStats.mobileUsers / (data.platformStats.mobileUsers + data.platformStats.desktopUsers)) * 100)}
            </div>
            <div className="text-xs text-gray-500 mt-1">of total users</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Ethereum Volume</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(data.platformStats.ethereumVolume)}
            </div>
            <div className="text-xs text-gray-500 mt-1">USDT, Wrapped Assets</div>
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Generation</h3>
        <div className="space-y-6">
          {/* Quick Reports */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quick Reports</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => generateQuickReport('daily')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Generate Daily Report
              </button>
              <button
                onClick={() => generateQuickReport('weekly')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                Generate Weekly Report
              </button>
              <button
                onClick={() => generateQuickReport('monthly')}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Generate Monthly Report
              </button>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Scheduled Reports</h4>
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {report.type} • {report.metrics.length} metrics • {report.format.toUpperCase()}
                    </div>
                    {report.lastGenerated && (
                      <div className="text-xs text-gray-500 mt-1">
                        Last generated: {report.lastGenerated.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onGenerateReport(report)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Generate Now
                    </button>
                    <button
                      onClick={() => onScheduleReport(report)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onExportData('csv', Array.from(selectedMetrics))}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => onExportData('json', Array.from(selectedMetrics))}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </button>
          <button
            onClick={() => onExportData('pdf', Array.from(selectedMetrics))}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF Report
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Data updated: {new Date().toLocaleString()} • 
          Date range: {data.dateRange.start.toLocaleDateString()} - {data.dateRange.end.toLocaleDateString()}
        </p>
        <p className="mt-1">
          Selected metrics: {Array.from(selectedMetrics).map(m => metricOptions.find(o => o.id === m)?.label).join(', ')}
        </p>
      </div>
    </div>
  );
}
