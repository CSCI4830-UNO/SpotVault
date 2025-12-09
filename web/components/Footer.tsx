"use client";

import { Spot, Comment } from "@/types/spot";
import Comments from "./Comments";

interface FooterProps {
  selectedSpot: Spot | null;
  pendingSpot: { lat: number; lng: number } | null;
  currentUsername: string;
  onDeleteSpot: () => void;
  onAddComment: (commentText: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function Footer({
  selectedSpot,
  pendingSpot,
  currentUsername,
  onDeleteSpot,
  onAddComment,
  onDeleteComment,
}: FooterProps) {
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