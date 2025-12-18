"use client";

import { useState, useMemo } from "react";
import { SpotList } from "@/types/list";
import { Spot } from "@/types/spot";
import AddButton from "./AddButton";

interface ListsProps {
  lists: SpotList[];
  spots: Spot[];
  publicSpots: Spot[];
  selectedListId: string | null;
  onListSelect: (list: SpotList | null) => void;
  onCreateList: () => void;
  onSpotSelect: (spot: Spot) => void;
  selectedSpotId: string | null;
  onAddSpotToList?: () => void;
  onModifyClick?: () => void;
  isModifyDisabled?: boolean;
  onToggleFavorite?: (spotId: string) => void;
  onDeleteList: (listId: string) => void;
}

const FAVORITES_LIST_ID = "__favorites__";

export default function Lists({
  lists,
  spots,
  publicSpots,
  selectedListId,
  onListSelect,
  onCreateList,
  onSpotSelect,
  selectedSpotId,
  onAddSpotToList,
  onModifyClick,
  isModifyDisabled,
  onToggleFavorite,
  onDeleteList,
}: ListsProps) {

  const [searchTerm, setSearchTerm] = useState("");

  // Get spots for the selected list
  const listSpots = useMemo(() => {
    if (!selectedListId) return [];

    const list = lists.find((l) => l.id === selectedListId);
    if (!list) return [];
    const allSpots = [...spots, ...publicSpots];
    return allSpots.filter((spot) => list.spotIds.includes(spot.id));
  }, [selectedListId, lists, spots]);

  // Filter lists based on search term
  const filteredLists = useMemo(() => {
    if (!searchTerm.trim()) {
      return lists;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return lists.filter((list) => {
      if (list.name?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      if (list.description?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      return false;
    });
  }, [lists, searchTerm]);

  // Filter list spots based on search term
  const filteredListSpots = useMemo(() => {
    if (!searchTerm.trim()) {
      return listSpots;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return listSpots.filter((spot) => {
      if (spot.name?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      if (spot.description?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      if (spot.tags?.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))) {
        return true;
      }
      return false;
    });
  }, [listSpots, searchTerm]);

  if (selectedListId) {
    // Show spots in the selected list
    const listName = selectedListId === FAVORITES_LIST_ID
      ? "Favorites"
      : lists.find((l) => l.id === selectedListId)?.name || "List";

    return (
      <div className="flex flex-col h-full text-white">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <button
            onClick={() => onListSelect(null)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            ← Back
          </button>
          <h3 className="font-semibold text-lg">{listName}</h3>
        </div>

        {/* Add and Modify Buttons */}
        {selectedListId !== FAVORITES_LIST_ID && onAddSpotToList && (
          <div className="flex gap-2 mb-4 flex-shrink-0">
            <AddButton
              onClick={onAddSpotToList}
              disabled={false}
            />
            {onModifyClick && (
              <button
                onClick={onModifyClick}
                disabled={isModifyDisabled}
                className={`px-4 py-2 rounded font-semibold transition-colors ${isModifyDisabled
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-blue-700 hover:bg-blue-600 cursor-pointer text-white"
                  }`}
              >
                MODIFY
              </button>
            )}
            {onDeleteList && (
              <button onClick={() => onDeleteList(selectedListId)}
                className="px-4 py-2 rounded font-semibold transition-colors bg-red-700 hover:bg-red-600 text-white" >
                DELETE LIST
              </button>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search spots in list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Scrollable List of Spots */}
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-3">
            {filteredListSpots.length === 0 ? (
              <li className="text-gray-400 text-center py-4">
                {searchTerm ? "No spots match your search" : "No spots in this list"}
              </li>
            ) : (
              filteredListSpots.map((spot) => (
                <li key={spot.id} onClick={() => onSpotSelect(spot)}
                  className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all ${selectedSpotId === spot.id
                    ? "bg-blue-700 ring-2 ring-blue-300"
                    : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  {/* Photo Preview or Placeholder */}
                  {spot.photos && spot.photos.length > 0 ? (
                    <img
                      src={spot.photos[0]}
                      alt={spot.name}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-600 rounded flex-shrink-0"></div>
                  )}
                  <span className="font-semibold text-lg flex-1">{spot.name}</span>
                  {/* Favorite Star */}
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(spot.id);
                      }}
                      className="flex-shrink-0 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title={spot.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {spot.isFavorite ? (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fillOpacity="0.3" />
                        </svg>
                      )}
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  // Show list of lists
  return (
    <div className="flex flex-col h-full text-white">
      {/* Create List Button */}
      <div className="mb-4 flex-shrink-0">
        <button
          onClick={onCreateList}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Create a List
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex-shrink-0">
        <input
          type="text"
          placeholder="Search lists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Scrollable List of Lists */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-3">
          {filteredLists.length === 0 ? (
            <li className="text-gray-400 text-center py-4">
              {searchTerm ? "No lists match your search" : "No lists yet. Create one to get started!"}
            </li>
          ) : (
            filteredLists.map((list) => (
              < li key={list.id} onClick={() => onListSelect(list)}
                className="flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all bg-gray-800 hover:bg-gray-700"
              >
                <div className="flex-1">
                  <span className="font-semibold text-lg block">{list.name}</span>
                  {list.description && (
                    <span className="text-gray-400 text-sm">{list.description}</span>
                  )}
                  <span className="text-gray-500 text-xs">
                    {list.spotIds?.length || list.spots?.length || 0} spot(s)
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div >
  );
}

