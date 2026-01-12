"use client";

import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Award,
  BarChart3,
  Calendar,
  Filter
} from "lucide-react";
import { mockLeads } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import Link from "next/link";

type DateFilter = "today" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "all" | "custom";

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const getDateRange = (filter: DateFilter): { start: Date; end: Date } | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case "today":
        return { start: today, end: now };
      case "last7days":
        return { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
      case "last30days":
        return { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
      case "thisMonth":
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
      case "lastMonth":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return { start: lastMonthStart, end: lastMonthEnd };
      case "custom":
        if (customStartDate && customEndDate) {
          return { 
            start: new Date(customStartDate), 
            end: new Date(customEndDate + "T23:59:59") 
          };
        }
        return null;
      case "all":
      default:
        return null;
    }
  };

  const filteredLeads = useMemo(() => {
    const dateRange = getDateRange(dateFilter);
    if (!dateRange) return mockLeads;

    return mockLeads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= dateRange.start && leadDate <= dateRange.end;
    });
  }, [dateFilter, customStartDate, customEndDate]);
  // Calculate statistics based on filtered leads
  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter(l => l.status === "New").length;
  const closedLeads = filteredLeads.filter(l => l.status === "Closed").length;
  const rejectedLeads = filteredLeads.filter(l => l.status === "Rejected").length;
  
  const totalRevenue = filteredLeads
    .filter(l => l.status === "Closed" && l.valuation.finalOfferPrice)
    .reduce((sum, l) => sum + (l.valuation.finalOfferPrice || 0), 0);
  
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;
  const avgDealValue = closedLeads > 0 ? totalRevenue / closedLeads : 0;

  // Recent leads
  const recentLeads = [...filteredLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Top performers
  const salesStats = filteredLeads.reduce((acc, lead) => {
    const exec = lead.customer.assignedSalesExecutive;
    if (!acc[exec]) {
      acc[exec] = { total: 0, closed: 0, revenue: 0 };
    }
    acc[exec].total++;
    if (lead.status === "Closed") {
      acc[exec].closed++;
      acc[exec].revenue += lead.valuation.finalOfferPrice || 0;
    }
    return acc;
  }, {} as Record<string, { total: number; closed: number; revenue: number }>);

  const topPerformers = Object.entries(salesStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.closed - a.closed)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your leads.
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center mb-3 md:mb-4">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary-600 mr-2" />
            <h3 className="text-base md:text-lg font-bold text-gray-900">Filter by Date</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
            <button
              onClick={() => setDateFilter("today")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "today"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("last7days")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "last7days"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter("last30days")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "last30days"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateFilter("thisMonth")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "thisMonth"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter("lastMonth")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "lastMonth"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setDateFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "all"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter("custom")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                dateFilter === "custom"
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Custom Date Range Picker */}
          {dateFilter === "custom" && (
            <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {dateFilter !== "all" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                📊 Showing data for: <span className="font-bold">
                  {dateFilter === "today" && "Today"}
                  {dateFilter === "last7days" && "Last 7 Days"}
                  {dateFilter === "last30days" && "Last 30 Days"}
                  {dateFilter === "thisMonth" && "This Month"}
                  {dateFilter === "lastMonth" && "Last Month"}
                  {dateFilter === "custom" && customStartDate && customEndDate && 
                    `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`}
                </span> • {totalLeads} leads found
              </p>
            </div>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Leads"
            value={totalLeads.toString()}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
            trend={{ value: "+12.5%", positive: true }}
            subtitle="vs last month"
          />
          <MetricCard
            title="Closed Deals"
            value={closedLeads.toString()}
            icon={CheckCircle2}
            gradient="from-green-500 to-emerald-500"
            trend={{ value: "+8.3%", positive: true }}
            subtitle="vs last month"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            gradient="from-purple-500 to-pink-500"
            trend={{ value: "+15.2%", positive: true }}
            subtitle="vs last month"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={Target}
            gradient="from-orange-500 to-red-500"
            trend={{ value: "-2.1%", positive: false }}
            subtitle="vs last month"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="New Leads"
            value={newLeads}
            icon={Activity}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Avg Deal Value"
            value={formatCurrency(avgDealValue)}
            icon={Award}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Rejected"
            value={rejectedLeads}
            icon={XCircle}
            color="from-red-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Top Performers */}
          <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                <Award className="h-5 w-5 md:h-6 md:w-6 mr-2 text-yellow-500" />
                Top Performers
              </h3>
              <Badge>This Month</Badge>
            </div>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">
                        {performer.closed} deals closed • {performer.total} total leads
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(performer.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status Distribution */}
          <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-primary-600" />
                Lead Status Distribution
              </h3>
            </div>
            <div className="space-y-4">
              <StatusBar
                label="New"
                count={filteredLeads.filter(l => l.status === "New").length}
                total={totalLeads}
                color="from-blue-500 to-cyan-500"
              />
              <StatusBar
                label="Contacted"
                count={filteredLeads.filter(l => l.status === "Contacted").length}
                total={totalLeads}
                color="from-purple-500 to-pink-500"
              />
              <StatusBar
                label="Valuation"
                count={filteredLeads.filter(l => l.status.includes("Valuation")).length}
                total={totalLeads}
                color="from-amber-500 to-orange-500"
              />
              <StatusBar
                label="Negotiation"
                count={filteredLeads.filter(l => l.status === "Negotiation").length}
                total={totalLeads}
                color="from-indigo-500 to-purple-500"
              />
              <StatusBar
                label="Closed"
                count={closedLeads}
                total={totalLeads}
                color="from-green-500 to-emerald-500"
              />
              <StatusBar
                label="Rejected"
                count={rejectedLeads}
                total={totalLeads}
                color="from-red-500 to-red-600"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 md:h-6 md:w-6 mr-2 text-primary-600" />
              Recent Leads
            </h3>
            <Link href="/leads" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">
                      {lead.customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {lead.customer.name} (Dealer)
                    </p>
                    <p className="text-sm text-gray-600">
                      {lead.vehicle.brand} {lead.vehicle.model} • {lead.vehicle.registrationYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {lead.vehicle.expectedPrice ? formatCurrency(lead.vehicle.expectedPrice) : "Pending"}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
                  </div>
                  <Badge variant="status">{lead.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
const MetricCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  trend: { value: string; positive: boolean };
  subtitle: string;
}) => (
  <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6 card-hover">
    <div className="flex items-start justify-between mb-3 md:mb-4">
      <div className={`h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br ${gradient} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
      </div>
      <div className={`flex items-center space-x-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${
        trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span>{trend.value}</span>
      </div>
    </div>
    <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">{title}</p>
    <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-[10px] md:text-xs text-gray-500">{subtitle}</p>
  </div>
);

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6 card-hover">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-xs md:text-sm font-medium mb-2">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`h-12 w-12 md:h-14 md:w-14 bg-gradient-to-br ${color} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
      </div>
    </div>
  </div>
);

// Status Bar Component
const StatusBar = ({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {count} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
