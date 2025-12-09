"use client";

import { useState } from "react";
import { Comment } from "@/types/spot";

interface CommentsProps {
  comments: Comment[];
  currentUsername: string;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function Comments({
  comments,
  currentUsername,
  onAddComment,
  onDeleteComment,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    onAddComment(newComment.trim());
    setNewComment("");
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">Comments</h4>
      
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{comment.username}</span>
                    <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
                {comment.username === currentUsername && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-red-400 hover:text-red-300 text-xs ml-2 px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

