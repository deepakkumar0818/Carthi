export type LeadSource = "Website" | "Call" | "Walk-in" | "Partner";
export type LeadStatus = "New" | "Contacted" | "Valuation Scheduled" | "Valuation Completed" | "Negotiation" | "Closed" | "Rejected";
export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
export type TransmissionType = "Manual" | "Automatic";
export type ValuationStatus = "Pending" | "Scheduled" | "Completed";
export type DocumentStatus = "Pending" | "Completed";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface CustomerDetails {
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  city: string;
  source: LeadSource;
  assignedSalesExecutive: string;
}

export interface VehicleDetails {
  brand: string;
  model: string;
  variant: string;
  registrationNumber: string;
  registrationYear: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  kmsDriven: number;
  ownership: number;
  insuranceValidTill?: string;
  expectedPrice?: number;
}

export interface ValuationDetails {
  status: ValuationStatus;
  assignedValuer?: string;
  inspectionDate?: string;
  estimatedPrice?: number;
  finalOfferPrice?: number;
  notes?: string;
}

export interface InternalProcess {
  relationshipManager?: string;
  followUpDates: string[];
  callNotes: string[];
  documentStatus: DocumentStatus;
  approvalStatus: ApprovalStatus;
}

export interface Lead {
  id: string;
  customer: CustomerDetails;
  vehicle: VehicleDetails;
  valuation: ValuationDetails;
  internal: InternalProcess;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus[];
  source?: LeadSource[];
  dateFrom?: string;
  dateTo?: string;
}
