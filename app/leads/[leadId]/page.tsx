"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Car,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import { mockLeads } from "@/lib/mockData";
import { Lead } from "@/types";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { showToast } from "@/components/Toaster";
import UpdateStatusModal from "@/components/UpdateStatusModal";
import AddNoteModal from "@/components/AddNoteModal";
import ScheduleInspectionModal from "@/components/ScheduleInspectionModal";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;

  const lead = mockLeads.find((l) => l.id === leadId);
  const [activeTab, setActiveTab] = useState<"dealer" | "vehicle" | "valuation" | "internal">("dealer");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="h-20 w-20 md:h-24 md:w-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FileText className="h-10 w-10 md:h-12 md:w-12 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Lead not found</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">The lead you're looking for doesn't exist.</p>
          <Button size="sm" onClick={() => router.push("/leads")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <button
            onClick={() => router.push("/leads")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 md:mb-6 group font-medium text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Leads
          </button>
          
          <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-3 md:space-x-6 mb-4 lg:mb-0">
                <div className="h-14 w-14 md:h-20 md:w-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    {lead.customer.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-2">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
                      {lead.customer.name}
                    </h1>
                    <div className="mt-1 md:mt-0">
                      <Badge variant="status">{lead.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">Lead ID: {lead.id}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-1 md:mt-2 text-xs md:text-sm text-gray-500">
                    <span>Created {formatDate(lead.createdAt)}</span>
                    <span className="hidden md:inline">•</span>
                    <span>Updated {formatDate(lead.updatedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button variant="primary" size="sm" onClick={() => setShowStatusModal(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Update Status</span>
                  <span className="sm:hidden">Status</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowInspectionModal(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Schedule</span>
                  <span className="sm:hidden">Book</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Tabs */}
            <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-1 md:space-x-2 px-3 md:px-6 min-w-max md:min-w-0">
                  <TabButton
                    active={activeTab === "dealer"}
                    onClick={() => setActiveTab("dealer")}
                    icon={User}
                  >
                    Dealer
                  </TabButton>
                  <TabButton
                    active={activeTab === "vehicle"}
                    onClick={() => setActiveTab("vehicle")}
                    icon={Car}
                  >
                    Vehicle
                  </TabButton>
                  <TabButton
                    active={activeTab === "valuation"}
                    onClick={() => setActiveTab("valuation")}
                    icon={DollarSign}
                  >
                    Valuation
                  </TabButton>
                  <TabButton
                    active={activeTab === "internal"}
                    onClick={() => setActiveTab("internal")}
                    icon={FileText}
                  >
                    Internal
                  </TabButton>
                </nav>
              </div>

              <div className="p-4 md:p-8">
                {activeTab === "dealer" && <CustomerSection lead={lead} />}
                {activeTab === "vehicle" && <VehicleSection lead={lead} />}
                {activeTab === "valuation" && <ValuationSection lead={lead} />}
                {activeTab === "internal" && <InternalSection lead={lead} />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                <Activity className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-600" />
                Quick Actions
              </h3>
              <div className="space-y-2 md:space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => setShowInspectionModal(true)}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Schedule Inspection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => setShowNoteModal(true)}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Add Note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    showToast("info", "Assigning valuation executive...");
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  Assign Valuer
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-600" />
                Contact Information
              </h3>
              <div className="space-y-3 md:space-y-4">
                <ContactItem
                  icon={Phone}
                  label="Primary Phone"
                  value={lead.customer.phone}
                  gradient="from-green-500 to-emerald-500"
                />
                {lead.customer.alternatePhone && (
                  <ContactItem
                    icon={Phone}
                    label="Alternate Phone"
                    value={lead.customer.alternatePhone}
                    gradient="from-blue-500 to-cyan-500"
                  />
                )}
                {lead.customer.email && (
                  <ContactItem
                    icon={Mail}
                    label="Email"
                    value={lead.customer.email}
                    gradient="from-purple-500 to-pink-500"
                  />
                )}
                <ContactItem
                  icon={MapPin}
                  label="Location"
                  value={lead.customer.city}
                  gradient="from-orange-500 to-red-500"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-effect rounded-xl md:rounded-2xl shadow-soft border border-white/20 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                <Clock className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-600" />
                Activity Timeline
              </h3>
              <div className="space-y-3 md:space-y-4">
                <TimelineItem
                  title="Lead Created"
                  date={lead.createdAt}
                  icon={CheckCircle}
                  color="from-blue-500 to-cyan-500"
                />
                {lead.valuation.inspectionDate && (
                  <TimelineItem
                    title="Inspection Scheduled"
                    date={lead.valuation.inspectionDate}
                    icon={Calendar}
                    color="from-amber-500 to-orange-500"
                  />
                )}
                {lead.valuation.status === "Completed" && (
                  <TimelineItem
                    title="Valuation Completed"
                    date={lead.updatedAt}
                    icon={Award}
                    color="from-green-500 to-emerald-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={lead.status}
        onUpdate={(newStatus) => {
          showToast("success", `Lead status updated to ${newStatus}`);
          setShowStatusModal(false);
        }}
      />
      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onAdd={(note) => {
          showToast("success", "Note added successfully");
          setShowNoteModal(false);
        }}
      />
      <ScheduleInspectionModal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
        onSchedule={(date, valuer) => {
          showToast("success", `Inspection scheduled for ${date}`);
          setShowInspectionModal(false);
        }}
      />
    </div>
  );
}

// Tab Button Component
const TabButton = ({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 md:px-6 py-3 md:py-4 font-semibold text-xs md:text-sm transition-all relative whitespace-nowrap ${
      active
        ? "text-primary-600"
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
    {children}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-full"></div>
    )}
  </button>
);

// Customer Section
const CustomerSection = ({ lead }: { lead: Lead }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard icon={User} label="Dealer Name" value={lead.customer.name} />
      <InfoCard icon={Phone} label="Phone Number" value={lead.customer.phone} />
      {lead.customer.alternatePhone && (
        <InfoCard icon={Phone} label="Alternate Phone" value={lead.customer.alternatePhone} />
      )}
      {lead.customer.email && (
        <InfoCard icon={Mail} label="Email Address" value={lead.customer.email} />
      )}
      <InfoCard icon={MapPin} label="City" value={lead.customer.city} />
      <InfoCard icon={Activity} label="Lead Source" value={lead.customer.source} badge />
      <InfoCard
        icon={User}
        label="Assigned Sales Executive"
        value={lead.customer.assignedSalesExecutive}
      />
    </div>
  </div>
);

// Vehicle Section
const VehicleSection = ({ lead }: { lead: Lead }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard icon={Car} label="Brand" value={lead.vehicle.brand} />
      <InfoCard icon={Car} label="Model" value={lead.vehicle.model} />
      <InfoCard icon={Car} label="Variant" value={lead.vehicle.variant} />
      <InfoCard icon={FileText} label="Registration Number" value={lead.vehicle.registrationNumber} />
      <InfoCard icon={Calendar} label="Registration Year" value={lead.vehicle.registrationYear.toString()} />
      <InfoCard icon={Activity} label="Fuel Type" value={lead.vehicle.fuelType} badge />
      <InfoCard icon={Activity} label="Transmission" value={lead.vehicle.transmission} badge />
      <InfoCard icon={TrendingUp} label="Kilometers Driven" value={lead.vehicle.kmsDriven.toLocaleString() + " km"} />
      <InfoCard icon={Award} label="Ownership" value={`${lead.vehicle.ownership}${lead.vehicle.ownership === 1 ? 'st' : lead.vehicle.ownership === 2 ? 'nd' : 'th'} Owner`} />
      {lead.vehicle.insuranceValidTill && (
        <InfoCard
          icon={FileText}
          label="Insurance Valid Till"
          value={formatDate(lead.vehicle.insuranceValidTill)}
        />
      )}
      {lead.vehicle.expectedPrice && (
        <InfoCard
          icon={DollarSign}
          label="Expected Price"
          value={formatCurrency(lead.vehicle.expectedPrice)}
          highlight
        />
      )}
    </div>
  </div>
);

// Valuation Section
const ValuationSection = ({ lead }: { lead: Lead }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard icon={Activity} label="Valuation Status" value={lead.valuation.status} badge />
      {lead.valuation.assignedValuer && (
        <InfoCard icon={User} label="Assigned Valuer" value={lead.valuation.assignedValuer} />
      )}
      {lead.valuation.inspectionDate && (
        <InfoCard
          icon={Calendar}
          label="Inspection Date"
          value={formatDate(lead.valuation.inspectionDate)}
        />
      )}
      {lead.valuation.estimatedPrice && (
        <InfoCard
          icon={DollarSign}
          label="Estimated Price"
          value={formatCurrency(lead.valuation.estimatedPrice)}
        />
      )}
      {lead.valuation.finalOfferPrice && (
        <InfoCard
          icon={DollarSign}
          label="Final Offer Price"
          value={formatCurrency(lead.valuation.finalOfferPrice)}
          highlight
        />
      )}
    </div>
    {lead.valuation.notes && (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-blue-100">
        <h4 className="text-xs md:text-sm font-bold text-blue-900 mb-2 md:mb-3 flex items-center">
          <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
          Valuation Notes
        </h4>
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{lead.valuation.notes}</p>
      </div>
    )}
  </div>
);

// Internal Process Section
const InternalSection = ({ lead }: { lead: Lead }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {lead.internal.relationshipManager && (
        <InfoCard
          icon={User}
          label="Relationship Manager"
          value={lead.internal.relationshipManager}
        />
      )}
      <InfoCard icon={FileText} label="Document Status" value={lead.internal.documentStatus} badge />
      <InfoCard icon={CheckCircle} label="Approval Status" value={lead.internal.approvalStatus} badge />
    </div>

    {lead.internal.followUpDates.length > 0 && (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-100">
        <h4 className="text-xs md:text-sm font-bold text-purple-900 mb-2 md:mb-3 flex items-center">
          <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
          Follow-up Dates
        </h4>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {lead.internal.followUpDates.map((date, index) => (
            <div
              key={index}
              className="flex items-center bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm border border-purple-200"
            >
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2 text-purple-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-900">{formatDate(date)}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {lead.internal.callNotes.length > 0 && (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-100">
        <h4 className="text-xs md:text-sm font-bold text-amber-900 mb-2 md:mb-3 flex items-center">
          <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
          Call Notes
        </h4>
        <div className="space-y-2 md:space-y-3">
          {lead.internal.callNotes.map((note, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-amber-200"
            >
              <p className="text-xs md:text-sm text-gray-700">{note}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Info Card Component
const InfoCard = ({
  icon: Icon,
  label,
  value,
  badge = false,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: boolean;
  highlight?: boolean;
}) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg md:rounded-xl p-3 md:p-5 border border-gray-200 hover:shadow-md transition-all">
    <div className="flex items-center mb-1.5 md:mb-2">
      <div className="h-7 w-7 md:h-8 md:w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
      </div>
      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
    </div>
    {badge ? (
      <Badge variant="status">{value}</Badge>
    ) : (
      <p
        className={`text-xs md:text-sm mt-1 ${
          highlight
            ? "text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            : "text-gray-900 font-semibold"
        }`}
      >
        {value}
      </p>
    )}
  </div>
);

// Contact Item Component
const ContactItem = ({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  gradient: string;
}) => (
  <div className="flex items-start space-x-2 md:space-x-3">
    <div className={`h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br ${gradient} rounded-lg md:rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
      <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xs md:text-sm font-bold text-gray-900 mt-0.5 md:mt-1 break-words">{value}</p>
    </div>
  </div>
);

// Timeline Item Component
const TimelineItem = ({
  title,
  date,
  icon: Icon,
  color,
}: {
  title: string;
  date: string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="flex items-start space-x-2 md:space-x-3">
    <div className={`h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br ${color} rounded-lg md:rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
      <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs md:text-sm font-bold text-gray-900">{title}</p>
      <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{formatDate(date)}</p>
    </div>
  </div>
);
