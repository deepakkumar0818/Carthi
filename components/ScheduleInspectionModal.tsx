"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

interface ScheduleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, valuer: string) => void;
}

const ScheduleInspectionModal = ({
  isOpen,
  onClose,
  onSchedule,
}: ScheduleInspectionModalProps) => {
  const [date, setDate] = useState("");
  const [valuer, setValuer] = useState("");

  const valuerOptions = [
    { value: "", label: "Select Valuer" },
    { value: "Prakash Joshi", label: "Prakash Joshi" },
    { value: "Rahul Mehta", label: "Rahul Mehta" },
    { value: "Vikram Singh", label: "Vikram Singh" },
    { value: "Amit Sharma", label: "Amit Sharma" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && valuer) {
      onSchedule(date, valuer);
      setDate("");
      setValuer("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Inspection" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="date"
          label="Inspection Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Select
          label="Assign Valuer"
          options={valuerOptions}
          value={valuer}
          onChange={(e) => setValuer(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Schedule Inspection</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInspectionModal;
