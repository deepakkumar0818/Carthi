"use client";

import { 
  Users, 
  Mail, 
  Phone, 
  Award, 
  TrendingUp, 
  Target,
  Plus,
  Search,
  Filter,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { mockLeads } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: "Active" | "Away" | "Busy";
  department: "Sales" | "Valuation" | "HR";
  joinedDate: string;
  leadsAssigned: number;
  leadsConverted: number;
  revenue: number;
  rating: number;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Amit Sharma",
    role: "Senior Sales Executive",
    email: "amit.sharma@carthi.com",
    phone: "+91 98765 43210",
    avatar: "AS",
    status: "Active",
    department: "Sales",
    joinedDate: "2023-01-15",
    leadsAssigned: 45,
    leadsConverted: 12,
    revenue: 8500000,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Vikram Singh",
    role: "Sales Executive",
    email: "vikram.singh@carthi.com",
    phone: "+91 98765 43211",
    avatar: "VS",
    status: "Active",
    department: "Sales",
    joinedDate: "2023-03-20",
    leadsAssigned: 38,
    leadsConverted: 9,
    revenue: 6200000,
    rating: 4.5,
  },
  {
    id: "3",
    name: "Prakash Joshi",
    role: "Lead Valuation Expert",
    email: "prakash.joshi@carthi.com",
    phone: "+91 98765 43212",
    avatar: "PJ",
    status: "Busy",
    department: "Valuation",
    joinedDate: "2022-11-10",
    leadsAssigned: 52,
    leadsConverted: 15,
    revenue: 10200000,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Rahul Mehta",
    role: "Valuation Specialist",
    email: "rahul.mehta@carthi.com",
    phone: "+91 98765 43213",
    avatar: "RM",
    status: "Active",
    department: "Valuation",
    joinedDate: "2023-05-01",
    leadsAssigned: 41,
    leadsConverted: 11,
    revenue: 7800000,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Sneha Patel",
    role: "HR Manager",
    email: "sneha.patel@carthi.com",
    phone: "+91 98765 43214",
    avatar: "SP",
    status: "Active",
    department: "HR",
    joinedDate: "2022-08-15",
    leadsAssigned: 35,
    leadsConverted: 8,
    revenue: 5500000,
    rating: 4.4,
  },
  {
    id: "6",
    name: "Rohan Kumar",
    role: "Sales Executive",
    email: "rohan.kumar@carthi.com",
    phone: "+91 98765 43215",
    avatar: "RK",
    status: "Away",
    department: "Sales",
    joinedDate: "2023-06-10",
    leadsAssigned: 32,
    leadsConverted: 7,
    revenue: 4900000,
    rating: 4.3,
  },
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "All" || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const totalRevenue = teamMembers.reduce((sum, m) => sum + m.revenue, 0);
  const totalLeads = teamMembers.reduce((sum, m) => sum + m.leadsAssigned, 0);
  const totalConverted = teamMembers.reduce((sum, m) => sum + m.leadsConverted, 0);
  const avgConversion = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Team Management
              </h1>
              <p className="text-gray-600">
                Manage your sales team and track their performance
              </p>
            </div>
            <Button size="lg" className="shadow-xl">
              <Plus className="h-5 w-5 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Team Members"
            value={teamMembers.length.toString()}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Total Leads"
            value={totalLeads.toString()}
            icon={Target}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Avg Conversion"
            value={`${avgConversion}%`}
            icon={Award}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Search and Filter */}
        <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium bg-white"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Sales", "Valuation", "HR"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    departmentFilter === dept
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
}) => (
  <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover">
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const conversionRate = member.leadsAssigned > 0 
    ? ((member.leadsConverted / member.leadsAssigned) * 100).toFixed(1)
    : 0;

  const statusColors = {
    Active: "from-green-500 to-emerald-500",
    Away: "from-yellow-500 to-amber-500",
    Busy: "from-red-500 to-red-600",
  };

  return (
    <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">{member.avatar}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
        <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${statusColors[member.status]} shadow-md`} />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{member.phone}</span>
        </div>
      </div>

      {/* Badge */}
      <div className="mb-4">
        <Badge>{member.department}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 mb-1">LEADS</p>
          <p className="text-2xl font-bold text-gray-900">{member.leadsAssigned}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs font-semibold text-green-600 mb-1">CONVERTED</p>
          <p className="text-2xl font-bold text-gray-900">{member.leadsConverted}</p>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-600">CONVERSION RATE</span>
          <span className="text-lg font-bold text-purple-900">{conversionRate}%</span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${conversionRate}%` }}
          />
        </div>
      </div>

      {/* Revenue & Rating */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(member.revenue)}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-bold text-gray-900">{member.rating}</span>
        </div>
      </div>
    </div>
  );
};
