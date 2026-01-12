import { z } from "zod";

export const addLeadSchema = z.object({
  // Customer Details
  customerName: z.string().min(2, "Dealer name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  source: z.enum(["Website", "Call", "Walk-in", "Partner"]),
  assignedSalesExecutive: z.string().min(2, "Sales executive is required"),

  // Vehicle Details
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  variant: z.string().min(2, "Variant is required"),
  registrationNumber: z.string().min(5, "Registration number is required"),
  registrationYear: z.number().min(1990).max(new Date().getFullYear()),
  fuelType: z.enum(["Petrol", "Diesel", "CNG", "Electric"]),
  transmission: z.enum(["Manual", "Automatic"]),
  kmsDriven: z.number().min(0, "Kilometers must be positive"),
  ownership: z.number().min(1).max(5),
  insuranceValidTill: z.string().optional(),
  expectedPrice: z.number().min(0, "Price must be positive").optional(),
});

export type AddLeadFormData = z.infer<typeof addLeadSchema>;
