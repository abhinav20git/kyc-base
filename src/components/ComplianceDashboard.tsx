import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Filter,
  Bot,
  Brain,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";

// TypeScript interfaces for AI-driven compliance
interface AIComplianceUser {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  amlStatus: "clear" | "flagged" | "pending";
  pepStatus: "clear" | "flagged" | "pending";
  sanctionsStatus: "clear" | "flagged" | "pending";
  lastScreened: string;
  aiDecision:
    | "auto_approved"
    | "auto_rejected"
    | "requires_human_review"
    | "pending_screening";
  aiConfidence: number; // AI confidence in decision (0-100)
  automationReason: string;
  processingTime: number; // milliseconds
  alerts: number;
  riskFactors: string[];
}

interface AISystemMetrics {
  totalProcessed: number;
  autoApproved: number;
  autoRejected: number;
  humanReviewRequired: number;
  averageProcessingTime: number; // seconds
  aiAccuracy: number; // percentage
  systemUptime: number; // percentage
}
interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  result: string;
}

interface ComplianceFilters {
  aiDecision: "all" | AIComplianceUser["aiDecision"];
  riskLevel: "all" | "high" | "medium" | "low";
  confidence: "all" | "high" | "medium" | "low";
  dateRange: "7days" | "30days" | "90days";
}

// Mock data with AI automation focus
const mockUsers: AIComplianceUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    riskScore: 25,
    amlStatus: "clear",
    pepStatus: "clear",
    sanctionsStatus: "clear",
    lastScreened: "2024-08-22T10:30:00Z",
    aiDecision: "auto_approved",
    aiConfidence: 94,
    automationReason:
      "Low risk profile, all screenings clear, standard customer pattern",
    processingTime: 1200,
    alerts: 0,
    riskFactors: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    riskScore: 45,
    amlStatus: "clear",
    pepStatus: "clear",
    sanctionsStatus: "clear",
    lastScreened: "2024-08-22T09:15:00Z",
    aiDecision: "auto_approved",
    aiConfidence: 87,
    automationReason:
      "Medium risk but within acceptable thresholds, no red flags detected",
    processingTime: 2100,
    alerts: 0,
    riskFactors: ["Medium transaction volume"],
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    riskScore: 92,
    amlStatus: "flagged",
    pepStatus: "flagged",
    sanctionsStatus: "clear",
    lastScreened: "2024-08-22T08:45:00Z",
    aiDecision: "auto_rejected",
    aiConfidence: 96,
    automationReason:
      "High risk score, multiple screening flags, suspicious pattern detected",
    processingTime: 3500,
    alerts: 3,
    riskFactors: [
      "PEP match (87%)",
      "Suspicious transaction patterns",
      "High-risk geography",
    ],
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    riskScore: 78,
    amlStatus: "clear",
    pepStatus: "flagged",
    sanctionsStatus: "pending",
    lastScreened: "2024-08-22T07:20:00Z",
    aiDecision: "requires_human_review",
    aiConfidence: 65,
    automationReason:
      "Borderline case: PEP match with medium confidence, requires human judgment",
    processingTime: 4200,
    alerts: 1,
    riskFactors: ["PEP match (65%)", "Incomplete sanctions screening"],
  },
  {
    id: "5",
    name: "Robert Chen",
    email: "robert@example.com",
    riskScore: 35,
    amlStatus: "pending",
    pepStatus: "clear",
    sanctionsStatus: "clear",
    lastScreened: "2024-08-22T06:10:00Z",
    aiDecision: "pending_screening",
    aiConfidence: 0,
    automationReason:
      "Screening in progress - AML check pending external API response",
    processingTime: 0,
    alerts: 0,
    riskFactors: [],
  },
];
const mockAuditLogs: AuditLog[] = [
  {
    id: "log1",
    timestamp: "2024-08-22T10:45:00Z",
    actor: "system",
    action: "Auto-approved user 1",
    result: "APPROVED",
  },
  {
    id: "log2",
    timestamp: "2024-08-22T09:30:00Z",
    actor: "system",
    action: "Auto-approved user 2",
    result: "APPROVED",
  },
  {
    id: "log3",
    timestamp: "2024-08-22T08:50:00Z",
    actor: "system",
    action: "Auto-rejected user 3",
    result: "REJECTED",
  },
  {
    id: "log4",
    timestamp: "2024-08-22T07:25:00Z",
    actor: "compliance_officer",
    action: "Manual review initiated for user 4",
    result: "PENDING",
  },
  {
    id: "log5",
    timestamp: "2024-08-22T06:15:00Z",
    actor: "system",
    action: "Screening started for user 5",
    result: "PENDING",
  },
];


const AIComplianceDashboard: React.FC = () => {
  const [users, setUsers] = useState<AIComplianceUser[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] =
    useState<AIComplianceUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<AIComplianceUser | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);
  const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLogs);

  const [filters, setFilters] = useState<ComplianceFilters>({
    aiDecision: "all",
    riskLevel: "all",
    confidence: "all",
    dateRange: "7days",
  });

  const [aiMetrics, setAiMetrics] = useState<AISystemMetrics>({
    totalProcessed: 2547,
    autoApproved: 2234,
    autoRejected: 245,
    humanReviewRequired: 68,
    averageProcessingTime: 2.3,
    aiAccuracy: 97.8,
    systemUptime: 99.9,
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setAiMetrics((prev) => ({
        ...prev,
        totalProcessed: prev.totalProcessed + Math.floor(Math.random() * 3),
        autoApproved: prev.autoApproved + Math.floor(Math.random() * 2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Filter users based on filters and search
  useEffect(() => {
    let filtered = users;

    // AI Decision filter
    if (filters.aiDecision !== "all") {
      filtered = filtered.filter(
        (user) => user.aiDecision === filters.aiDecision
      );
    }

    // Risk level filter
    if (filters.riskLevel !== "all") {
      filtered = filtered.filter((user) => {
        if (filters.riskLevel === "high") return user.riskScore >= 70;
        if (filters.riskLevel === "medium")
          return user.riskScore >= 40 && user.riskScore < 70;
        if (filters.riskLevel === "low") return user.riskScore < 40;
        return true;
      });
    }

    // AI Confidence filter
    if (filters.confidence !== "all") {
      filtered = filtered.filter((user) => {
        if (filters.confidence === "high") return user.aiConfidence >= 90;
        if (filters.confidence === "medium")
          return user.aiConfidence >= 70 && user.aiConfidence < 90;
        if (filters.confidence === "low") return user.aiConfidence < 70;
        return true;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.automationReason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters, searchTerm]);

  const getDecisionColor = (
    decision: AIComplianceUser["aiDecision"]
  ): string => {
    switch (decision) {
      case "auto_approved":
        return "text-green-600 bg-green-100 border-green-300";
      case "auto_rejected":
        return "text-red-600 bg-red-100 border-red-300";
      case "requires_human_review":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "pending_screening":
        return "text-blue-600 bg-blue-100 border-blue-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getRiskColor = (score: number): string => {
    if (score >= 70) return "text-red-600 bg-red-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (
    status: AIComplianceUser["amlStatus"]
  ): JSX.Element => {
    switch (status) {
      case "clear":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleFilterChange = (
    filterType: keyof ComplianceFilters,
    value: string
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleOverride = (
    userId: string,
    decision: "approve" | "reject"
  ): void => {
    const timestamp = new Date().toISOString();

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              aiDecision:
                decision === "approve" ? "auto_approved" : "auto_rejected",
              automationReason: `Human override: Manually ${decision}d by compliance officer`,
            }
          : user
      )
    );

    // Add log entry
    setAuditLog((prevLogs) => [
      ...prevLogs,
      {
        id: `${Date.now()}`,
        timestamp,
        actor: "compliance_officer",
        action: `Manual override on user ${userId}`,
        result: decision.toUpperCase(),
      },
    ]);

    setSelectedUser(null);
  };

  // AI System Metrics Component
  const AISystemMetrics: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Requests Processed Today
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {aiMetrics.totalProcessed.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600">
              Avg: {aiMetrics.averageProcessingTime}s
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Auto Approved</p>
            <p className="text-2xl font-bold text-gray-900">
              {aiMetrics.autoApproved.toLocaleString()}
            </p>
            <p className="text-xs text-green-600">
              {(
                (aiMetrics.autoApproved / aiMetrics.totalProcessed) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Accuracy</p>
            <p className="text-2xl font-bold text-gray-900">
              {aiMetrics.aiAccuracy}%
            </p>
            <p className="text-xs text-purple-600">
              System Uptime: {aiMetrics.systemUptime}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Human Review Required
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {aiMetrics.humanReviewRequired}
            </p>
            <p className="text-xs text-yellow-600">
              {(
                (aiMetrics.humanReviewRequired / aiMetrics.totalProcessed) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Decision Details Modal
  const AIDecisionModal: React.FC<{
    user: AIComplianceUser;
    onClose: () => void;
  }> = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                Decision Analysis - {user.name}
              </h2>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getDecisionColor(
                    user.aiDecision
                  )}`}
                >
                  {user.aiDecision.replace("_", " ").toUpperCase()}
                </span>
                <span
                  className={`text-sm font-semibold ${getConfidenceColor(
                    user.aiConfidence
                  )}`}
                >
                  {user.aiConfidence > 0
                    ? `${user.aiConfidence}% Confidence`
                    : "Processing..."}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                AI Analysis
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Decision Reason:</h4>
                  <p className="text-sm text-gray-700">
                    {user.automationReason}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Processing Time:</h4>
                  <p className="text-sm text-gray-700">
                    {user.processingTime > 0
                      ? `${(user.processingTime / 1000).toFixed(1)} seconds`
                      : "In progress..."}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Risk Score:</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          user.riskScore >= 70
                            ? "bg-red-500"
                            : user.riskScore >= 40
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${user.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {user.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Screening Results</h3>
              <div className="space-y-3 mb-6">
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
                    <span className="ml-2 capitalize">
                      {user.sanctionsStatus}
                    </span>
                  </div>
                </div>
              </div>

              {user.riskFactors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Risk Factors Detected</h3>
                  <div className="space-y-2">
                    {user.riskFactors.map((factor, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="flex">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="ml-2 text-sm text-red-800">
                            {factor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {user.aiDecision === "requires_human_review" && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Human Override Options</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOverride(user.id, "approve")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Override: Approve
                </button>
                <button
                  onClick={() => handleOverride(user.id, "reject")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Override: Reject
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Request Additional Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bot className="w-8 h-8 mr-3 text-blue-500" />
                Compliance Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                AML, PEP, and sanctions screening
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    realTimeUpdates
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  } mr-2`}
                ></div>
                <span className="text-sm text-gray-600">
                  {realTimeUpdates ? "Live Updates" : "Updates Paused"}
                </span>
              </div>
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
              >
                {realTimeUpdates ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
        </div>

        <AISystemMetrics />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search by name, email, or AI reasoning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.aiDecision}
                onChange={(e) =>
                  handleFilterChange("aiDecision", e.target.value)
                }
              >
                <option value="all">All AI Decisions</option>
                <option value="auto_approved">Auto Approved</option>
                <option value="auto_rejected">Auto Rejected</option>
                <option value="requires_human_review">
                  Needs Human Review
                </option>
                <option value="pending_screening">Pending Screening</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.confidence}
                onChange={(e) =>
                  handleFilterChange("confidence", e.target.value)
                }
              >
                <option value="all">All Confidence Levels</option>
                <option value="high">High Confidence (90%+)</option>
                <option value="medium">Medium Confidence (70-89%)</option>
                <option value="low">Low Confidence (&lt;70%)</option>
              </select>

              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
                <Download className="w-4 h-4 mr-1" />
                Export AI Logs
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
                    Decision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screening Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getDecisionColor(
                          user.aiDecision
                        )}`}
                      >
                        {user.aiDecision.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${getConfidenceColor(
                          user.aiConfidence
                        )}`}
                      >
                        {user.aiConfidence > 0 ? `${user.aiConfidence}%` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                          user.riskScore
                        )}`}
                      >
                        {user.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <div title="AML">{getStatusIcon(user.amlStatus)}</div>
                        <div title="PEP">{getStatusIcon(user.pepStatus)}</div>
                        <div title="Sanctions">
                          {getStatusIcon(user.sanctionsStatus)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.processingTime > 0
                        ? `${(user.processingTime / 1000).toFixed(1)}s`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                      >
                        <Brain className="w-4 h-4 mr-1" />
                        View Analysis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <AIDecisionModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
        {/* Audit Trail Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
            <p className="text-sm text-gray-600 mt-1">Recent compliance actions and system decisions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLog.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {log.actor.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.result === 'APPROVED' ? 'text-green-700 bg-green-100' :
                        log.result === 'REJECTED' ? 'text-red-700 bg-red-100' :
                        'text-yellow-700 bg-yellow-100'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     {/* Audit Trail Table */}
       

    </div>
  );
};

export default AIComplianceDashboard;
