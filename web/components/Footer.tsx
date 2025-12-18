"use client";

import { Spot, Comment } from "@/types/spot";
import { SpotList } from "@/types/list";
import Comments from "./Comments";
import SpotPhotos from "./SpotPhotos";
import { useAuth } from "@/lib/AuthContext";
import EditableField from "./utils/editablefield";

interface FooterProps {
  selectedSpot: Spot | null;
  pendingSpot: { lat: number; lng: number } | null;
  currentUsername: string;
  lists: SpotList[];
  onDeleteSpot: () => void;
  onAddComment: (commentText: string) => void;
  onDeleteComment: (commentId: string) => void;
  onListClick: (listId: string) => void;
  onRemoveSpotFromList: () => void;
  onAddPhoto?: (photoDataUrl: string) => void;
  onDeletePhoto?: (photoIndex: number) => void;
  activeTab: "spots" | "lists" | "browse";
  selectedList: SpotList | null;
  onPublish: () => void;
  onUpdateSpot(name: string, description: string, tags: string[]): void;
}

export default function Footer({
  selectedSpot,
  pendingSpot,
  currentUsername,
  onPublish,
  lists,
  onDeleteSpot,
  onAddComment,
  onDeleteComment,
  onListClick,
  onRemoveSpotFromList,
  onAddPhoto,
  onDeletePhoto,
  activeTab,
  selectedList,
  onUpdateSpot,
}: FooterProps) {

  const { userId } = useAuth()
  return (
    <footer className="h-[50vh] flex-shrink-0 rounded-lg bg-black p-4">
      {selectedSpot ? (
        <div className="border rounded-lg p-4 h-full flex flex-col">
          <div className="flex gap-4 h-full">
            {/*left*/}
            <div className="flex flex-col gap-4 w-1/4 flex-shrink-0">
              <div>
                <h1><EditableField
                  value={selectedSpot.name || ""}
                  onSave={(newName: string) => {
                    onUpdateSpot(
                      newName,
                      selectedSpot?.description || "",
                      selectedSpot?.tags || []
                    );
                  }}
                  isLocked={selectedSpot.isPublic}
                  isTextarea={true}
                /></h1>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Coordinates</h4>
                <p className="text-white text-sm">{selectedSpot.latitude?.toFixed(4) || "N/A"}</p>
                <p className="text-white text-sm">{selectedSpot.longitude?.toFixed(4) || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Notes</h4>
                <EditableField
                  value={selectedSpot.description || ""}
                  onSave={(newDescription: string) => {
                    onUpdateSpot(
                      selectedSpot?.name || "",
                      newDescription,
                      selectedSpot?.tags || []
                    );
                  }}
                  isLocked={selectedSpot.isPublic}
                  isTextarea={true}
                />
              </div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <EditableField
                  value={selectedSpot.tags?.join(", ") || ""}
                  onSave={(newTagsString) => {
                    const newTags = newTagsString
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0);
                    onUpdateSpot(
                      selectedSpot?.name || "",
                      selectedSpot?.description || "",
                      newTags
                    );
                  }}
                  isLocked={selectedSpot.isPublic}
                />
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                {/*created a div to hold the buttons cuz there's 3 of 'em and they look weird stacked up like that.*/}
                {activeTab === "lists" && selectedList && (
                  <button onClick={onRemoveSpotFromList}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm" >
                    Remove from List
                  </button>
                )}
                {!selectedSpot.isPublic && selectedSpot.creator_id == userId && (
                  <button onClick={onPublish} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm" >
                    Publish
                  </button>
                )}
                {!selectedSpot.isPublic && selectedSpot.creator_id == userId && (
                  <button onClick={onDeleteSpot}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors" >
                    DELETE SPOT
                  </button>
                )}
              </div>
            </div>
            {/* middle - Comments Section */}
            <div className="flex-1 min-h-0">
              <Comments
                comments={selectedSpot.comments || []}
                currentUsername={currentUsername}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
              />
            </div>

            {/* right - photos section */}
            {onAddPhoto && onDeletePhoto && (
              <div className="flex flex-col gap-2 w-1/4 flex-shrink-0">
                <SpotPhotos
                  photos={selectedSpot.photos || []}
                  onAddPhoto={onAddPhoto}
                  onDeletePhoto={onDeletePhoto}
                />
              </div>
            )}
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
      )
      }
    </footer >
  )
};
