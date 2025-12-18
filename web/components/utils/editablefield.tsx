"use client";

import { useState } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  isLocked: boolean;
  isTextarea?: boolean;
}

export default function EditableField({
  value,
  onSave,
  isLocked,
  isTextarea = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex gap-2 items-start">
      {/*text, whether textarea or just an input box*/}
      {isEditing ? (
        isTextarea ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 bg-gray-700 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none resize-none"
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 bg-gray-700 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
          />

        )
      ) : (
        <div>
          {/*edit button*/}
          <span className="text-white text-sm flex-1 break-words">
            {value || "—"}
          </span>
          {!isLocked ? (
            <button onClick={() => {
              setEditValue(value);
              setIsEditing(true);
            }}
              className="text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0" title="Edit" >
              ✎
            </button>
          ) : (
            <span className="text-gray-500 flex-shrink-0" title="Locked (public spot)">
              🔒
            </span>
          )}
        </div>
      )}
    </div>
  );
}
