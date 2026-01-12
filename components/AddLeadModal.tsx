"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { addLeadSchema, AddLeadFormData } from "@/lib/validations";
import { gujaratCityOptions } from "@/lib/gujaratCities";
import { User, Car, MapPin, Phone, Mail, Calendar, Fuel, Settings } from "lucide-react";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddLeadFormData) => void;
}

const AddLeadModal = ({ isOpen, onClose, onAdd }: AddLeadModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AddLeadFormData>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: {
      source: "Website",
      fuelType: "Petrol",
      transmission: "Manual",
      ownership: 1,
      registrationYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: AddLeadFormData) => {
    try {
      onAdd(data);
      reset();
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    reset();
    setCurrentStep(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Lead" size="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-semibold text-primary-600">
              {currentStep === 1 ? "Dealer Details" : "Vehicle Details"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Customer Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Dealer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Dealer Name *"
                    placeholder="Enter dealer name"
                    error={errors.customerName?.message}
                    {...register("customerName")}
                  />
                </div>
                <Input
                  label="Phone Number *"
                  type="tel"
                  placeholder="+91 98765 43210"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="Alternate Phone"
                  type="tel"
                  placeholder="+91 98765 43211"
                  error={errors.alternatePhone?.message}
                  {...register("alternatePhone")}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="dealer@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <div className="w-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City (Gujarat) *
                  </label>
                  <select
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                    {...register("city")}
                  >
                    <option value="">Select City</option>
                    {gujaratCityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Lead Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Lead Source *"
                  options={[
                    { value: "Website", label: "Website" },
                    { value: "Call", label: "Call" },
                    { value: "Walk-in", label: "Walk-in" },
                    { value: "Partner", label: "Partner" },
                  ]}
                  error={errors.source?.message}
                  {...register("source")}
                />
                <Select
                  label="Assigned Sales Executive *"
                  options={[
                    { value: "", label: "Select Executive" },
                    { value: "Amit Sharma", label: "Amit Sharma" },
                    { value: "Vikram Singh", label: "Vikram Singh" },
                    { value: "Rohan Kumar", label: "Rohan Kumar" },
                    { value: "Prakash Joshi", label: "Prakash Joshi" },
                  ]}
                  error={errors.assignedSalesExecutive?.message}
                  {...register("assignedSalesExecutive")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-green-600" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand *"
                  placeholder="Maruti Suzuki"
                  error={errors.brand?.message}
                  {...register("brand")}
                />
                <Input
                  label="Model *"
                  placeholder="Swift"
                  error={errors.model?.message}
                  {...register("model")}
                />
                <Input
                  label="Variant *"
                  placeholder="VXI"
                  error={errors.variant?.message}
                  {...register("variant")}
                />
                <Input
                  label="Registration Number *"
                  placeholder="MH-02-AB-1234"
                  error={errors.registrationNumber?.message}
                  {...register("registrationNumber")}
                />
                <Input
                  label="Registration Year *"
                  type="number"
                  placeholder="2020"
                  error={errors.registrationYear?.message}
                  {...register("registrationYear", { valueAsNumber: true })}
                />
                <Select
                  label="Fuel Type *"
                  options={[
                    { value: "Petrol", label: "Petrol" },
                    { value: "Diesel", label: "Diesel" },
                    { value: "CNG", label: "CNG" },
                    { value: "Electric", label: "Electric" },
                  ]}
                  error={errors.fuelType?.message}
                  {...register("fuelType")}
                />
                <Select
                  label="Transmission *"
                  options={[
                    { value: "Manual", label: "Manual" },
                    { value: "Automatic", label: "Automatic" },
                  ]}
                  error={errors.transmission?.message}
                  {...register("transmission")}
                />
                <Input
                  label="Kilometers Driven *"
                  type="number"
                  placeholder="45000"
                  error={errors.kmsDriven?.message}
                  {...register("kmsDriven", { valueAsNumber: true })}
                />
                <Select
                  label="Ownership *"
                  options={[
                    { value: "1", label: "1st Owner" },
                    { value: "2", label: "2nd Owner" },
                    { value: "3", label: "3rd Owner" },
                    { value: "4", label: "4th Owner" },
                    { value: "5", label: "5th Owner" },
                  ]}
                  error={errors.ownership?.message}
                  {...register("ownership", { valueAsNumber: true })}
                />
                <Input
                  label="Insurance Valid Till"
                  type="date"
                  error={errors.insuranceValidTill?.message}
                  {...register("insuranceValidTill")}
                />
                <Input
                  label="Expected Price (₹)"
                  type="number"
                  placeholder="550000"
                  error={errors.expectedPrice?.message}
                  {...register("expectedPrice", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting}>
                Create Lead
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeadModal;
