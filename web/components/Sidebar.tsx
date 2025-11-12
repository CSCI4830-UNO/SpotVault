"use client";

import { Spot } from "@/types/spot";
import Spots from "@/components/Spots";

interface SidebarProps {
  spots: Spot[];
  selectedSpotId: string | null;
  isAddDisabled: boolean;
  onSpotSelect: (spot: Spot) => void;
  onAddClick: () => void;
}

export default function Sidebar({
  spots,
  selectedSpotId,
  isAddDisabled,
  onSpotSelect,
  onAddClick,
}: SidebarProps) {
  return (
    <aside className="flex-[1] rounded-lg bg-black p-4">
      <Spots
        spots={spots}
        selectedSpotId={selectedSpotId}
        onSpotSelect={onSpotSelect}
        isAddDisabled={isAddDisabled}
        onAddClick={onAddClick}
      />
    </aside>
  );
}