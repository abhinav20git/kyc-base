import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Search, Download, Filter } from 'lucide-react';

// TypeScript interfaces
interface ComplianceUser {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  amlStatus: 'clear' | 'flagged' | 'pending';
  pepStatus: 'clear' | 'flagged' | 'pending';
  sanctionsStatus: 'clear' | 'flagged' | 'pending';
  lastScreened: string;
  alerts: number;
  status: 'approved' | 'under_review' | 'rejected' | 'pending';
}

interface ComplianceFilters {
  riskLevel: 'all' | 'high' | 'medium' | 'low';
  status: 'all' | 'approved' | 'under_review' | 'rejected' | 'pending';
  dateRange: '7days' | '30days' | '90days';
}

interface ComplianceMetricsData {
  clearUsers: number;
  underReview: number;
  flagged: number;
  pendingScreening: number;
}

// Mock data with proper TypeScript typing
const mockUsers: ComplianceUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    riskScore: 85,
    amlStatus: 'clear',
    pepStatus: 'flagged',
    sanctionsStatus: 'clear',
    lastScreened: '2024-08-22T10:30:00Z',
    alerts: 1,
    status: 'under_review'
  },
  {
    id: '2', 
    name: 'Jane Smith',
    email: 'jane@example.com',
    riskScore: 25,
    amlStatus: 'clear',
    pepStatus: 'clear',
    sanctionsStatus: 'clear',
    lastScreened: '2024-08-22T09:15:00Z',
    alerts: 0,
    status: 'approved'
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    riskScore: 92,
    amlStatus: 'flagged',
    pepStatus: 'flagged',
    sanctionsStatus: 'clear',
    lastScreened: '2024-08-22T08:45:00Z',
    alerts: 3,
    status: 'rejected'
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    riskScore: 45,
    amlStatus: 'clear',
    pepStatus: 'clear',
    sanctionsStatus: 'pending',
    lastScreened: '2024-08-22T07:20:00Z',
    alerts: 0,
    status: 'pending'
  }
];

const ComplianceDashboard: React.FC = () => {
  const [users, setUsers] = useState<ComplianceUser[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<ComplianceUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<ComplianceUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [filters, setFilters] = useState<ComplianceFilters>({
    riskLevel: 'all',
    status: 'all',
    dateRange: '7days'
  });

  // Mock metrics data
  const [metrics, setMetrics] = useState<ComplianceMetricsData>({
    clearUsers: 1247,
    underReview: 43,
    flagged: 12,
    pendingScreening: 8
  });

  // Filter users based on filters and search
  useEffect(() => {
    let filtered = users;

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(user => {
        if (filters.riskLevel === 'high') return user.riskScore >= 80;
        if (filters.riskLevel === 'medium') return user.riskScore >= 50 && user.riskScore < 80;
        if (filters.riskLevel === 'low') return user.riskScore < 50;
        return true;
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters, searchTerm]);

  const getRiskColor = (score: number): string => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = (status: ComplianceUser['amlStatus']): JSX.Element => {
    switch (status) {
      case 'clear': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleFilterChange = (filterType: keyof ComplianceFilters, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExport = (): void => {
    // Mock export functionality
    console.log('Exporting compliance data...');
    // In real implementation, this would call an API to generate CSV/PDF
  };

  const handleUserAction = (userId: string, action: 'approve' | 'reject' | 'rescreen'): void => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending'
            }
          : user
      )
    );
    setSelectedUser(null);
  };

  // Compliance Metrics Component
  const ComplianceMetrics: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Clear Users</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.clearUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Under Review</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.underReview}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <XCircle className="w-8 h-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Flagged</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.flagged}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Screening</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.pendingScreening}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // User Details Modal Component
  const UserDetailsModal: React.FC<{ user: ComplianceUser; onClose: () => void }> = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Compliance Details - {user.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">User Information</h3>
              <div className="space-y-2 mb-6">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">User ID:</span> {user.id}</p>
                <p><span className="font-medium">Last Screened:</span> {new Date(user.lastScreened).toLocaleDateString()}</p>
              </div>

              <h3 className="font-semibold mb-4">Screening Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>AML Check:</span>
                  <div className="flex items-center">
                    {getStatusIcon(user.amlStatus)}
                    <span className="ml-2 capitalize">{user.amlStatus}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>PEP Check:</span>
                  <div className="flex items-center">
                    {getStatusIcon(user.pepStatus)}
                    <span className="ml-2 capitalize">{user.pepStatus}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sanctions:</span>
                  <div className="flex items-center">
                    {getStatusIcon(user.sanctionsStatus)}
                    <span className="ml-2 capitalize">{user.sanctionsStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Risk Assessment</h3>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Risk Score</span>
                  <span className="font-semibold">{user.riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      user.riskScore >= 80 ? 'bg-red-500' : 
                      user.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${user.riskScore}%` }}
                  />
                </div>
              </div>

              {user.alerts > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Active Alerts ({user.alerts})</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800">
                          {user.pepStatus === 'flagged' && 'PEP Match: Potential match found in political figures database'}
                          {user.amlStatus === 'flagged' && 'AML Alert: Suspicious transaction patterns detected'}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Confidence: 85% | Last updated: 2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button 
              onClick={() => handleUserAction(user.id, 'approve')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button 
              onClick={() => handleUserAction(user.id, 'reject')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button 
              onClick={() => handleUserAction(user.id, 'rescreen')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Re-screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor AML, PEP, and sanctions screening results</p>
        </div>

        <ComplianceMetrics />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.riskLevel}
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk (80+)</option>
                <option value="medium">Medium Risk (50-79)</option>
                <option value="low">Low Risk (&lt;50)</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="under_review">Under Review</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
              
              <button 
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AML
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PEP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sanctions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(user.riskScore)}`}>
                          {user.riskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIcon(user.amlStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIcon(user.pepStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIcon(user.sanctionsStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.alerts > 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {user.alerts}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          user.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ComplianceDashboard;