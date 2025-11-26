"use client";

import { useState } from "react";

interface SettingsPopupProps {
  // Current radio menu selection
  radioSelection: number;
  // Callback to close the popup
  onCancel: () => void;
}

export default function SettingsPopup({
  onCancel,
}: SettingsPopupProps) {
  const [name, setName] = useState("");

  return (
    // This is the modal container
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4">Cool New Spot</h3>
        
        {/* Form Input */}
        <div className="mb-4">
          <label htmlFor="spotName" className="block text-sm font-medium text-gray-300 mb-1">
            Spot Name
          </label>
          <input
            type="text"
            id="spotName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Downtown Skate Park"
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}