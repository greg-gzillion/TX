'use client';

import * as React from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export interface Auction {
  id: string;
  title: string;
  metalType: string;
  weight: number;
  purity: string;
  seller: string;
  currentBid: number;
  reservePrice: number;
  status: 'draft' | 'live' | 'paused' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  bids: number;
  views: number;
  createdAt: Date;
}

export interface AuctionStats {
  totalAuctions: number;
  liveAuctions: number;
  completedAuctions: number;
  totalVolume: number;
  avgBidCount: number;
  successRate: number;
}

export interface AuctionManagementDashboardProps {
  auctions: Auction[];
  stats: AuctionStats;
  onViewAuction: (auctionId: string) => void;
  onEditAuction: (auctionId: string) => void;
  onPauseAuction: (auctionId: string) => void;
  onResumeAuction: (auctionId: string) => void;
  onCancelAuction: (auctionId: string) => void;
  onExportData: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function AuctionManagementDashboard({
  auctions,
  stats,
  onViewAuction,
  onEditAuction,
  onPauseAuction,
  onResumeAuction,
  onCancelAuction,
  onExportData,
  onRefresh,
  isLoading = false,
}: AuctionManagementDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedAuctions, setSelectedAuctions] = React.useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');

  const filteredAuctions = React.useMemo(() => {
    return auctions.filter(auction => {
      const matchesSearch = 
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.metalType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || auction.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [auctions, searchQuery, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAuctions(new Set(filteredAuctions.map(a => a.id)));
    } else {
      setSelectedAuctions(new Set());
    }
  };

  const handleSelectAuction = (auctionId: string, checked: boolean) => {
    const newSet = new Set(selectedAuctions);
    if (checked) {
      newSet.add(auctionId);
    } else {
      newSet.delete(auctionId);
    }
    setSelectedAuctions(newSet);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return '📝';
      case 'live': return '⚡';
      case 'paused': return '⏸️';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📊';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTimeLeft = (endTime: Date) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auction Management</h1>
          <p className="text-gray-600">Monitor and manage all platform auctions</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => onExportData('csv')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAuctions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Live</span>
              <span className="font-medium text-green-600">{stats.liveAuctions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalVolume)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Bid Count</span>
              <span className="font-medium">{stats.avgBidCount.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAuctions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium text-green-600">{stats.successRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Bidders</p>
              <p className="text-2xl font-bold text-gray-900">{(auctions.reduce((acc, a) => acc + a.bids, 0) / auctions.length || 0).toFixed(0)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Views</span>
              <span className="font-medium">{(auctions.reduce((acc, a) => acc + a.views, 0) / auctions.length || 0).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedAuctions.size} selected
            </span>
            {selectedAuctions.size > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    selectedAuctions.forEach(id => {
                      const auction = auctions.find(a => a.id === id);
                      if (auction?.status === 'live') onPauseAuction(id);
                    });
                  }}
                  className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                >
                  Pause Selected
                </button>
                <button
                  onClick={() => {
                    selectedAuctions.forEach(id => onCancelAuction(id));
                  }}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Cancel Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAuctions.size === filteredAuctions.length && filteredAuctions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Bid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAuctions.has(auction.id)}
                        onChange={(e) => handleSelectAuction(auction.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{auction.title}</div>
                        <div className="text-sm text-gray-500">
                          {auction.weight.toFixed(3)} oz {auction.metalType} • {auction.purity}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{auction.seller}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(auction.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                        <span className="mr-1">{getStatusIcon(auction.status)}</span>
                        {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(auction.currentBid)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Reserve: {formatCurrency(auction.reservePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {calculateTimeLeft(auction.endTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ends: {formatDate(auction.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewAuction(auction.id)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditAuction(auction.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {auction.status === 'live' && (
                          <button
                            onClick={() => onPauseAuction(auction.id)}
                            className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                            title="Pause"
                          >
                            ⏸️
                          </button>
                        )}
                        {auction.status === 'paused' && (
                          <button
                            onClick={() => onResumeAuction(auction.id)}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            title="Resume"
                          >
                            ▶️
                          </button>
                        )}
                        <button
                          onClick={() => onCancelAuction(auction.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <div key={auction.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{auction.title}</h3>
                    <p className="text-sm text-gray-500">{auction.metalType} • {auction.purity}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{auction.weight.toFixed(3)} oz</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Bid</span>
                    <span className="font-medium text-green-600">{formatCurrency(auction.currentBid)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Left</span>
                    <span className="font-medium">{calculateTimeLeft(auction.endTime)}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => onViewAuction(auction.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditAuction(auction.id)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onCancelAuction(auction.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">No auctions found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
          >
            Grid View
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredAuctions.length} of {auctions.length} auctions
        {searchQuery && ` • Searching: "${searchQuery}"`}
        {statusFilter !== 'all' && ` • Filtered by: ${statusFilter}`}
      </div>
    </div>
  );
}
