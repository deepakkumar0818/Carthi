"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (note: string) => void;
}

const AddNoteModal = ({ isOpen, onClose, onAdd }: AddNoteModalProps) => {
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAdd(note);
      setNote("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Call Note" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            placeholder="Enter your call note or follow-up details..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Note</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNoteModal;
