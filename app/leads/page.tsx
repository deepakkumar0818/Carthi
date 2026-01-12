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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Lead Management
              </h1>
              <p className="text-gray-600">
                Track and manage all your used car leads in one place
              </p>
            </div>
            <Button size="lg" className="shadow-xl" onClick={() => setShowAddModal(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add New Lead
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
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
  <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover">
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
        {trend}
      </span>
    </div>
    <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const LeadCard = ({ lead }: { lead: Lead }) => (
  <Link href={`/leads/${lead.id}`}>
    <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-6 card-hover cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {lead.customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {lead.customer.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Lead ID: {lead.id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="status">{lead.status}</Badge>
          <Badge>{lead.customer.source}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {/* Vehicle Info */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 mb-2">VEHICLE DETAILS</p>
          <p className="text-lg font-bold text-gray-900">
            {lead.vehicle.brand} {lead.vehicle.model}
          </p>
          <p className="text-sm text-gray-600">{lead.vehicle.variant}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{lead.vehicle.fuelType}</Badge>
            <Badge>{lead.vehicle.transmission}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {lead.vehicle.registrationYear} • {lead.vehicle.kmsDriven.toLocaleString()} km
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <p className="text-xs font-semibold text-purple-600 mb-2">CONTACT INFO</p>
          <p className="text-sm font-bold text-gray-900">{lead.customer.phone}</p>
          {lead.customer.email && (
            <p className="text-xs text-gray-600 mt-1">{lead.customer.email}</p>
          )}
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <span className="inline-block h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
            {lead.customer.city}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Sales: {lead.customer.assignedSalesExecutive}
          </p>
        </div>

        {/* Pricing Info */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <p className="text-xs font-semibold text-green-600 mb-2">PRICING</p>
          {lead.vehicle.expectedPrice && (
            <div className="mb-2">
              <p className="text-xs text-gray-600">Expected Price</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(lead.vehicle.expectedPrice)}
              </p>
            </div>
          )}
          {lead.valuation.finalOfferPrice && (
            <div>
              <p className="text-xs text-gray-600">Final Offer</p>
              <p className="text-md font-bold text-green-600">
                {formatCurrency(lead.valuation.finalOfferPrice)}
              </p>
            </div>
          )}
          {!lead.vehicle.expectedPrice && !lead.valuation.finalOfferPrice && (
            <p className="text-gray-500 italic">Pending valuation</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 font-semibold text-gray-900">{formatDate(lead.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-500">Updated:</span>
            <span className="ml-2 font-semibold text-gray-900">{formatDate(lead.updatedAt)}</span>
          </div>
        </div>
        <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
          <span className="mr-2">View Details</span>
          <Eye className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </Link>
);
