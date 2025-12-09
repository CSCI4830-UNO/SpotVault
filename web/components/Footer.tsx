"use client";

import { Spot, Comment } from "@/types/spot";
import { SpotList } from "@/types/list";
import Comments from "./Comments";
import SpotPhotos from "./SpotPhotos";

interface FooterProps {
  selectedSpot: Spot | null;
  pendingSpot: { lat: number; lng: number } | null;
  currentUsername: string;
  lists: SpotList[];
  onDeleteSpot: () => void;
  onAddComment: (commentText: string) => void;
  onDeleteComment: (commentId: string) => void;
  onListClick: (listId: string) => void;
  onAddSpotToList?: (listId: string) => void;
  onRemoveSpotFromList?: () => void;
  onAddPhoto?: (photoDataUrl: string) => void;
  onDeletePhoto?: (photoIndex: number) => void;
}

export default function Footer({
  selectedSpot,
  pendingSpot,
  currentUsername,
  lists,
  onDeleteSpot,
  onAddComment,
  onDeleteComment,
  onListClick,
  onAddSpotToList,
  onRemoveSpotFromList,
  onAddPhoto,
  onDeletePhoto,
}: FooterProps) {
  const spotList = selectedSpot?.listId
    ? lists.find((l) => l.id === selectedSpot.listId)
    : null;
  const availableLists = lists.filter((l) => l.id !== selectedSpot?.listId);
  return (
    <footer className="h-[30vh] flex-shrink-0 rounded-lg bg-black p-4">
      {selectedSpot ? (
        <div className="border rounded-lg p-4 h-full flex flex-col">
          <div className="grid grid-cols-3 gap-6 mb-4 flex-shrink-0">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Coordinates</h4>
              <p className="text-white text-sm">{selectedSpot.latitude?.toFixed(4) || "N/A"}</p>
              <p className="text-white text-sm">{selectedSpot.longitude?.toFixed(4) || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Notes</h4>
              <p className="text-white text-sm max-h-16 overflow-hidden">
                {selectedSpot.description || "None"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSpot.tags && selectedSpot.tags.length > 0 ? (
                  selectedSpot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Photos Section */}
          {onAddPhoto && onDeletePhoto && (
            <div className="mb-4 flex-shrink-0">
              <SpotPhotos
                photos={selectedSpot.photos || []}
                onAddPhoto={onAddPhoto}
                onDeletePhoto={onDeletePhoto}
              />
            </div>
          )}

          {/* List Information */}
          <div className="mb-4 flex-shrink-0">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">List</h4>
            {spotList ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onListClick(spotList.id)}
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  {spotList.name}
                </button>
                {onRemoveSpotFromList && (
                  <button
                    onClick={onRemoveSpotFromList}
                    className="text-red-400 hover:text-red-300 text-xs"
                    title="Remove from list"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : (
              <div>
                {availableLists.length > 0 && onAddSpotToList ? (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onAddSpotToList(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="">Add to list...</option>
                    {availableLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-400 text-xs">Not in any list</span>
                )}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="flex-1 min-h-0 mb-4">
            <Comments
              comments={selectedSpot.comments || []}
              currentUsername={currentUsername}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
            />
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onDeleteSpot}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              DELETE SPOT
            </button>
          </div>
        </div>
      ) : pendingSpot ? (
        <div className="text-yellow-400 flex items-center justify-center h-full text-lg">
          New spot selected. Press 'ADD' to save details.
        </div>
      ) : (
        <div className="text-gray-500 flex items-center justify-center h-full">
          Select a spot or click the map to add a new one.
        </div>
      )}
    </footer>
  );
}