"use client";

import { Spot } from "@/types/spot";
import Spots from "@/components/Spots";

interface SidebarProps {
  spots: Spot[];
  selectedSpotId: string | null;
  isAddDisabled: boolean;
  isModifyDisabled: boolean;
  onSpotSelect: (spot: Spot) => void;
  onAddClick: () => void;
  onModifyClick: () => void;
}

export default function Sidebar({
  spots,
  selectedSpotId,
  isAddDisabled,
  isModifyDisabled,
  onSpotSelect,
  onAddClick,
  onModifyClick,
}: SidebarProps) {
  return (
    <aside className="flex-[1] rounded-lg bg-black p-4">
      <Spots
        spots={spots}
        selectedSpotId={selectedSpotId}
        onSpotSelect={onSpotSelect}
        isAddDisabled={isAddDisabled}
        isModifyDisabled={isModifyDisabled}
        onAddClick={onAddClick}
        onModifyClick={onModifyClick}
      />
    </aside>
  );
}