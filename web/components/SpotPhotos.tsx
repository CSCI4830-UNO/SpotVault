"use client";

import { useState } from "react";

interface SpotPhotosProps {
  photos: string[];
  onAddPhoto: (photoDataUrl: string) => void;
  onDeletePhoto: (photoIndex: number) => void;
}

export default function SpotPhotos({
  photos,
  onAddPhoto,
  onDeletePhoto,
}: SpotPhotosProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onAddPhoto(dataUrl);
      }
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    };
    reader.onerror = () => {
      alert("Error reading image file");
      setIsUploading(false);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-300">Photos</h4>
        <label className="text-blue-400 hover:text-blue-300 text-xs cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? "Uploading..." : "+ Add Photo"}
        </label>
      </div>

      {photos.length === 0 ? (
        <p className="text-gray-400 text-xs">No photos yet</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative flex-shrink-0 group">
              <img
                src={photo}
                crossOrigin="anonymous"
                alt={`Spot photo ${index + 1}`}
                className="w-20 h-20 object-cover rounded border border-gray-700"
              />
              <button
                onClick={() => onDeletePhoto(index)}
                className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Delete photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

