"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Select } from "./Select";
import { LeadStatus } from "@/types";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: LeadStatus;
  onUpdate: (newStatus: LeadStatus) => void;
}

const UpdateStatusModal = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
}: UpdateStatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(currentStatus);

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Valuation Scheduled", label: "Valuation Scheduled" },
    { value: "Valuation Completed", label: "Valuation Completed" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Closed", label: "Closed" },
    { value: "Rejected", label: "Rejected" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Lead Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Status: <span className="font-bold">{currentStatus}</span>
          </label>
          <Select
            label="New Status"
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update Status</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateStatusModal;
