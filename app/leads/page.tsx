"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Plus, TrendingUp, Users, CheckCircle2, XCircle, Eye } from "lucide-react";
import { mockLeads } from "@/lib/mockData";
import { Lead, LeadStatus, LeadSource } from "@/types";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatDate, formatCurrency } from "@/lib/utils";
import AddLeadModal from "@/components/AddLeadModal";
import { showToast } from "@/components/Toaster";
import { AddLeadFormData } from "@/lib/validations";

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [sourceFilter, setSourceFilter] = useState<LeadSource[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const handleAddLead = (data: AddLeadFormData) => {
    const newLead: Lead = {
      id: `L${String(leads.length + 1).padStart(3, "0")}`,
      customer: {
        name: data.customerName,
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        email: data.email || undefined,
        city: data.city,
        source: data.source,
        assignedSalesExecutive: data.assignedSalesExecutive,
      },
      vehicle: {
        brand: data.brand,
        model: data.model,
        variant: data.variant,
        registrationNumber: data.registrationNumber,
        registrationYear: data.registrationYear,
        fuelType: data.fuelType,
        transmission: data.transmission,
        kmsDriven: data.kmsDriven,
        ownership: data.ownership,
        insuranceValidTill: data.insuranceValidTill,
        expectedPrice: data.expectedPrice,
      },
      valuation: {
        status: "Pending",
      },
      internal: {
        followUpDates: [],
        callNotes: [],
        documentStatus: "Pending",
        approvalStatus: "Pending",
      },
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeads([newLead, ...leads]);
    showToast("success", `Lead ${newLead.id} created successfully!`);
  };

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.customer.phone.includes(searchQuery) ||
        lead.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(lead.status);

      const matchesSource =
        sourceFilter.length === 0 || sourceFilter.includes(lead.customer.source);

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [searchQuery, statusFilter, sourceFilter]);

  const toggleStatusFilter = (status: LeadStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleSourceFilter = (source: LeadSource) => {
    setSourceFilter((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setSourceFilter([]);
    setSearchQuery("");
  };

  const stats = {
    total: filteredLeads.length,
    new: filteredLeads.filter((l) => l.status === "New").length,
    inProgress: filteredLeads.filter(
      (l) =>
        l.status === "Contacted" ||
        l.status === "Valuation Scheduled" ||
        l.status === "Negotiation"
    ).length,
    closed: filteredLeads.filter((l) => l.status === "Closed").length,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                Lead Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Track and manage all your used car leads
              </p>
            </div>
            <Button size="md" className="shadow-xl w-full sm:w-auto" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="sm:inline">Add Lead</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Leads"
            value={stats.total}
            icon={TrendingUp}
            gradient="from-blue-500 to-cyan-500"
            trend="+12%"
          />
          <StatCard
            title="New Leads"
            value={stats.new}
            icon={Users}
            gradient="from-purple-500 to-pink-500"
            trend="+8%"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Filter}
            gradient="from-amber-500 to-orange-500"
            trend="+15%"
          />
          <StatCard
            title="Closed"
            value={stats.closed}
            icon={CheckCircle2}
            gradient="from-green-500 to-emerald-500"
            trend="+5%"
          />
        </div>

        {/* Search and Filters */}
        <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, car model, or lead ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium bg-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(statusFilter.length > 0 || sourceFilter.length > 0) && (
                <span className="ml-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md">
                  {statusFilter.length + sourceFilter.length}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Filter by Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["New", "Contacted", "Valuation Scheduled", "Valuation Completed", "Negotiation", "Closed", "Rejected"] as LeadStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => toggleStatusFilter(status)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            statusFilter.includes(status)
                              ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md scale-105"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Filter by Source
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["Website", "Call", "Walk-in", "Partner"] as LeadSource[]).map(
                      (source) => (
                        <button
                          key={source}
                          onClick={() => toggleSourceFilter(source)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            sourceFilter.includes(source)
                              ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md scale-105"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                          }`}
                        >
                          {source}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {(statusFilter.length > 0 || sourceFilter.length > 0) && (
                <div className="mt-6">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leads - Mobile Card View / Desktop Table View */}
        {filteredLeads.length === 0 ? (
          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-8 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 md:h-24 md:w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No leads found</h3>
              <p className="text-sm md:text-base text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {filteredLeads.map((lead) => (
                <MobileLeadCard key={lead.id} lead={lead} />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-effect rounded-2xl shadow-soft border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                        ID
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                        Dealer
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-44">
                        Contact
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-48">
                        Vehicle
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                        City
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                        Price
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                        Source
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                        Created
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredLeads.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLead}
      />
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  trend: string;
}) => (
  <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6 card-hover">
    <div className="flex items-center justify-between mb-2 md:mb-4">
      <div className={`h-8 w-8 md:h-12 md:w-12 bg-gradient-to-br ${gradient} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
      </div>
      <span className="text-green-600 text-[10px] md:text-sm font-bold bg-green-50 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
        {trend}
      </span>
    </div>
    <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">{title}</p>
    <p className="text-xl md:text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Mobile Card Component
const MobileLeadCard = ({ lead }: { lead: Lead }) => (
  <Link href={`/leads/${lead.id}`}>
    <div className="glass-effect rounded-xl shadow-soft border border-white/20 p-4 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {lead.customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900">{lead.customer.name}</p>
            <p className="text-xs text-gray-500">{lead.id}</p>
          </div>
        </div>
        <Badge variant="status">{lead.status}</Badge>
      </div>

      {/* Vehicle */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-3">
        <p className="text-xs font-bold text-blue-600 mb-1">VEHICLE</p>
        <p className="text-sm font-bold text-gray-900">
          {lead.vehicle.brand} {lead.vehicle.model}
        </p>
        <p className="text-xs text-gray-600">{lead.vehicle.variant}</p>
        <div className="flex gap-1 mt-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">
            {lead.vehicle.fuelType}
          </span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold">
            {lead.vehicle.transmission}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Contact</p>
          <p className="text-sm font-semibold text-gray-900">{lead.customer.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">City</p>
          <p className="text-sm font-semibold text-gray-900">{lead.customer.city}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-sm font-bold text-green-600">
            {lead.vehicle.expectedPrice ? formatCurrency(lead.vehicle.expectedPrice) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Source</p>
          <Badge>{lead.customer.source}</Badge>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {formatDate(lead.createdAt)}
        </p>
        <button className="text-primary-600 font-semibold text-sm flex items-center gap-1">
          View <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  </Link>
);

// Desktop Table Row
const LeadRow = ({ lead }: { lead: Lead }) => (
  <tr className="hover:bg-blue-50/50 transition-colors group">
    <td className="px-3 py-3 whitespace-nowrap">
      <Link
        href={`/leads/${lead.id}`}
        className="text-sm font-bold text-primary-600 hover:text-primary-700"
      >
        {lead.id}
      </Link>
    </td>
    <td className="px-3 py-3 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-bold text-xs">
            {lead.customer.name.charAt(0)}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate">{lead.customer.name}</span>
      </div>
    </td>
    <td className="px-3 py-3">
      <div className="text-xs">
        <p className="font-semibold text-gray-900">{lead.customer.phone}</p>
        {lead.customer.email && (
          <p className="text-gray-500 truncate">{lead.customer.email}</p>
        )}
      </div>
    </td>
    <td className="px-3 py-3">
      <div className="text-xs">
        <p className="font-bold text-gray-900">
          {lead.vehicle.brand} {lead.vehicle.model}
        </p>
        <p className="text-gray-600 text-[10px]">{lead.vehicle.variant}</p>
        <div className="flex gap-1 mt-1">
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-semibold">
            {lead.vehicle.fuelType}
          </span>
          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-semibold">
            {lead.vehicle.transmission}
          </span>
        </div>
      </div>
    </td>
    <td className="px-3 py-3 whitespace-nowrap">
      <span className="text-xs font-medium text-gray-900">{lead.customer.city}</span>
    </td>
    <td className="px-3 py-3 whitespace-nowrap">
      <span className="text-xs font-bold text-green-600">
        {lead.vehicle.expectedPrice
          ? formatCurrency(lead.vehicle.expectedPrice)
          : "-"}
      </span>
    </td>
    <td className="px-3 py-3 whitespace-nowrap">
      <Badge>{lead.customer.source}</Badge>
    </td>
    <td className="px-3 py-3 whitespace-nowrap">
      <Badge variant="status">{lead.status}</Badge>
    </td>
    <td className="px-3 py-3">
      <div className="text-[10px]">
        <p className="font-semibold text-gray-900">{formatDate(lead.createdAt)}</p>
        <p className="text-gray-500 truncate">{lead.customer.assignedSalesExecutive}</p>
      </div>
    </td>
    <td className="px-3 py-3 whitespace-nowrap text-center">
      <Link href={`/leads/${lead.id}`}>
        <button className="p-2 text-primary-600 hover:text-white hover:bg-primary-600 font-semibold rounded-lg border-2 border-primary-600 transition-all" title="View Details">
          <Eye className="h-4 w-4" />
        </button>
      </Link>
    </td>
  </tr>
);
