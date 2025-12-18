"use client";

import { SpotList } from "@/types/list";

interface SaveButtonProps {
  spotId: string;
  lists: SpotList[];
  onSaveToList: (listId: string) => void;
  isDisabled?: boolean;
}

export default function SaveButton({
  spotId,
  lists,
  onSaveToList,
  isDisabled = false,
}: SaveButtonProps) {
  return (
    <select
      onChange={(e) => {
        if (e.target.value) {
          onSaveToList(e.target.value);
          e.target.value = ""; // Reset dropdown
        }
      }}
      disabled={isDisabled || lists.length === 0}
      className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      defaultValue=""
    >
      <option value="">Save to list...</option>
      {lists.map((list) => (
        <option key={list.id} value={list.id}>
          {list.name}
        </option>
      ))}
    </select>
  );
}
