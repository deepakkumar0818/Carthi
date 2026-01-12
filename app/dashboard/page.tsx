"use client";

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
  BarChart3
} from "lucide-react";
import { mockLeads } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import Link from "next/link";

export default function DashboardPage() {
  // Calculate statistics
  const totalLeads = mockLeads.length;
  const newLeads = mockLeads.filter(l => l.status === "New").length;
  const closedLeads = mockLeads.filter(l => l.status === "Closed").length;
  const rejectedLeads = mockLeads.filter(l => l.status === "Rejected").length;
  
  const totalRevenue = mockLeads
    .filter(l => l.status === "Closed" && l.valuation.finalOfferPrice)
    .reduce((sum, l) => sum + (l.valuation.finalOfferPrice || 0), 0);
  
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;
  const avgDealValue = closedLeads > 0 ? totalRevenue / closedLeads : 0;

  // Recent leads
  const recentLeads = [...mockLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Top performers
  const salesStats = mockLeads.reduce((acc, lead) => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your leads today.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Award className="h-6 w-6 mr-2 text-yellow-500" />
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
          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-primary-600" />
                Lead Status Distribution
              </h3>
            </div>
            <div className="space-y-4">
              <StatusBar
                label="New"
                count={mockLeads.filter(l => l.status === "New").length}
                total={totalLeads}
                color="from-blue-500 to-cyan-500"
              />
              <StatusBar
                label="Contacted"
                count={mockLeads.filter(l => l.status === "Contacted").length}
                total={totalLeads}
                color="from-purple-500 to-pink-500"
              />
              <StatusBar
                label="Valuation"
                count={mockLeads.filter(l => l.status.includes("Valuation")).length}
                total={totalLeads}
                color="from-amber-500 to-orange-500"
              />
              <StatusBar
                label="Negotiation"
                count={mockLeads.filter(l => l.status === "Negotiation").length}
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
        <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-600" />
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
                      {lead.customer.name}
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
  <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover">
    <div className="flex items-start justify-between mb-4">
      <div className={`h-12 w-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
        trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span>{trend.value}</span>
      </div>
    </div>
    <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
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
  <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`h-14 w-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-7 w-7 text-white" />
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
