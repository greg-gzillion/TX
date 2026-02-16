'use client';

import * as React from 'react';
import { Search, Filter, Download, Eye, AlertCircle, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

export interface Transaction {
  id: string;
  transactionHash: string;
  type: 'auction_payment' | 'escrow_deposit' | 'escrow_release' | 'refund' | 'withdrawal' | 'fee';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'disputed';
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: string;
  network: 'XRPL' | 'Coreum' | 'Ethereum' | 'Solana';
  timestamp: Date;
  confirmedAt?: Date;
  blockHeight?: number;
  fee: number;
  gasUsed?: number;
  auctionId?: string;
  userId: string;
  userName: string;
  notes?: string;
  riskScore?: number;
}

export interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  pendingTransactions: number;
  failedTransactions: number;
  avgConfirmationTime: number; // in seconds
  todayVolume: number;
  todayCount: number;
  disputeCount: number;
  successRate: number;
}

export interface NetworkStats {
  network: string;
  count: number;
  volume: number;
  avgFee: number;
}

export interface TransactionMonitoringDashboardProps {
  transactions: Transaction[];
  stats: TransactionStats;
  networkStats: NetworkStats[];
  onViewTransaction: (transactionId: string) => void;
  onViewExplorer: (transactionHash: string, network: string) => void;
  onFlagTransaction: (transactionId: string, reason: string) => void;
  onResolveDispute: (transactionId: string, resolution: 'refund' | 'release' | 'partial') => void;
  onExportTransactions: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  onRealTimeToggle: (enabled: boolean) => void;
  realTimeEnabled?: boolean;
  isLoading?: boolean;
}

export default function TransactionMonitoringDashboard({
  transactions,
  stats,
  networkStats,
  onViewTransaction,
  onViewExplorer,
  onFlagTransaction,
  onResolveDispute,
  onExportTransactions,
  onRefresh,
  onRealTimeToggle,
  realTimeEnabled = false,
  isLoading = false,
}: TransactionMonitoringDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [networkFilter, setNetworkFilter] = React.useState<string>('all');
  const [timeRange, setTimeRange] = React.useState<'1h' | '24h' | '7d' | '30d' | 'all'>('24h');
  const [selectedTransactions, setSelectedTransactions] = React.useState<Set<string>>(new Set());
  const [showRiskFilter, setShowRiskFilter] = React.useState<boolean>(false);
  const [minAmount, setMinAmount] = React.useState<number>(0);
  const [maxAmount, setMaxAmount] = React.useState<number>(1000000);

  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    let timeFiltered = transactions;

    // Apply time range filter
    if (timeRange !== 'all') {
      const hoursMap = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720,
      };
      const hours = hoursMap[timeRange];
      const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
      timeFiltered = timeFiltered.filter(t => new Date(t.timestamp) >= cutoff);
    }

    return timeFiltered.filter(transaction => {
      const matchesSearch = 
        transaction.transactionHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.toAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.auctionId && transaction.auctionId.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesNetwork = networkFilter === 'all' || transaction.network === networkFilter;
      const matchesAmount = transaction.amount >= minAmount && transaction.amount <= maxAmount;
      
      return matchesSearch && matchesType && matchesStatus && matchesNetwork && matchesAmount;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter, networkFilter, timeRange, minAmount, maxAmount]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'auction_payment': return 'bg-blue-100 text-blue-800';
      case 'escrow_deposit': return 'bg-green-100 text-green-800';
      case 'escrow_release': return 'bg-purple-100 text-purple-800';
      case 'refund': return 'bg-yellow-100 text-yellow-800';
      case 'withdrawal': return 'bg-red-100 text-red-800';
      case 'fee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'XRPL': return 'bg-black text-white';
      case 'Coreum': return 'bg-purple-100 text-purple-800';
      case 'Ethereum': return 'bg-gray-800 text-gray-100';
      case 'Solana': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskScore?: number) => {
    if (!riskScore) return 'bg-gray-100 text-gray-800';
    if (riskScore >= 80) return 'bg-red-100 text-red-800';
    if (riskScore >= 60) return 'bg-orange-100 text-orange-800';
    if (riskScore >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currency}`;
  };

  const formatTimeAgo = (date: Date) => {
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

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'auction_payment': return '🏷️';
      case 'escrow_deposit': return '🤝';
      case 'escrow_release': return '✅';
      case 'refund': return '↩️';
      case 'withdrawal': return '🏧';
      case 'fee': return '💰';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Monitoring</h1>
          <p className="text-gray-600">Real-time tracking and monitoring of all platform transactions</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => onRealTimeToggle(!realTimeEnabled)}
            className={`flex items-center px-4 py-2 rounded-lg ${realTimeEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${realTimeEnabled ? 'bg-green-300 animate-pulse' : 'bg-gray-400'}`} />
            {realTimeEnabled ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(stats.totalVolume)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Today</span>
              <span className="font-medium text-green-600">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(stats.todayVolume)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Today</span>
              <span className="font-medium">{stats.todayCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Confirmation</span>
              <span className="font-medium">{formatTime(stats.avgConfirmationTime)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending & Disputed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingTransactions}/{stats.disputeCount}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Failed</span>
              <span className="font-medium text-red-600">{stats.failedTransactions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {networkStats.map((network) => (
            <div key={network.network} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(network.network)}`}>
                  {network.network}
                </span>
                <span className="text-sm font-medium">{network.count}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(network.volume)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Fee</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(network.avgFee)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="space-y-4">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by transaction hash, address, user, or auction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRiskFilter(!showRiskFilter)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showRiskFilter ? 'Hide Risk Filter' : 'Risk Filter'}
              </button>
              <button
                onClick={() => onExportTransactions('csv')}
                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="auction_payment">Auction Payment</option>
                <option value="escrow_deposit">Escrow Deposit</option>
                <option value="escrow_release">Escrow Release</option>
                <option value="refund">Refund</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="fee">Fee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
              <select
                value={networkFilter}
                onChange={(e) => setNetworkFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Networks</option>
                <option value="XRPL">XRPL</option>
                <option value="Coreum">Coreum</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Solana">Solana</option>
              </select>
            </div>
          </div>

          {/* Risk Filter */}
          {showRiskFilter && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(parseFloat(e.target.value) || 1000000)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="1000000"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setMinAmount(0);
                      setMaxAmount(1000000);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Reset Amount Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network & Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time & User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-mono text-sm text-gray-900">
                        {transaction.transactionHash.slice(0, 12)}...{transaction.transactionHash.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <span className="mr-2">From: {transaction.fromAddress.slice(0, 8)}...</span>
                        <span>To: {transaction.toAddress.slice(0, 8)}...</span>
                      </div>
                      {transaction.auctionId && (
                        <div className="text-xs text-blue-600 mt-1">
                          Auction: {transaction.auctionId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTransactionTypeIcon(transaction.type)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                          {transaction.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee: {transaction.fee.toFixed(6)} {transaction.currency}
                    </div>
                    {transaction.gasUsed && (
                      <div className="text-xs text-gray-500">
                        Gas: {transaction.gasUsed.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(transaction.network)}`}>
                        {transaction.network}
                      </span>
                      {transaction.riskScore !== undefined && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(transaction.riskScore)}`}>
                          Risk: {transaction.riskScore}/100
                        </span>
                      )}
                      {transaction.blockHeight && (
                        <div className="text-xs text-gray-500">
                          Block: {transaction.blockHeight.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatTimeAgo(transaction.timestamp)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {transaction.userName}
                    </div>
                    {transaction.confirmedAt && (
                      <div className="text-xs text-green-600">
                        Confirmed: {formatTimeAgo(transaction.confirmedAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewTransaction(transaction.id)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewExplorer(transaction.transactionHash, transaction.network)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="View on Explorer"
                      >
                        🔍
                      </button>
                      {transaction.status === 'disputed' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onResolveDispute(transaction.id, 'release')}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            title="Release Funds"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onResolveDispute(transaction.id, 'refund')}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Refund Buyer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {transaction.status !== 'disputed' && transaction.status !== 'failed' && (
                        <button
                          onClick={() => onFlagTransaction(transaction.id, 'Suspicious activity')}
                          className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                          title="Flag Transaction"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or time range</p>
          </div>
        )}
      </div>

      {/* Summary and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-3">Recent Alerts</h3>
          <div className="space-y-2">
            {filteredTransactions
              .filter(t => t.riskScore && t.riskScore >= 70)
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <div className="text-sm font-medium">{transaction.userName}</div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(transaction.riskScore)}`}>
                    {transaction.riskScore}/100
                  </span>
                </div>
              ))}
            {filteredTransactions.filter(t => t.riskScore && t.riskScore >= 70).length === 0 && (
              <p className="text-sm text-yellow-700">No high-risk transactions detected</p>
            )}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Status Summary</h3>
          <div className="space-y-2">
            {['confirmed', 'pending', 'failed', 'disputed', 'cancelled'].map((status) => {
              const count = filteredTransactions.filter(t => t.status === status).length;
              const percentage = filteredTransactions.length > 0 ? (count / filteredTransactions.length * 100).toFixed(1) : 0;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
              <div className="text-xs text-gray-600">Filtered Tx</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-gray-900">
                {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Amount</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-gray-900">
                {(filteredTransactions.reduce((sum, t) => sum + t.fee, 0)).toFixed(4)}
              </div>
              <div className="text-xs text-gray-600">Total Fees</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-gray-900">
                {filteredTransactions.filter(t => t.status === 'disputed').length}
              </div>
              <div className="text-xs text-gray-600">Disputed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {timeRange !== 'all' && ` • Time range: ${timeRange}`}
          {searchQuery && ` • Searching: "${searchQuery}"`}
        </p>
        <p className="mt-1">
          Real-time updates: {realTimeEnabled ? 'Enabled' : 'Disabled'} •
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
