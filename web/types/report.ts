/**
 * Report data model
 * Represents a user report (spot, comment, or bug)
 */
export interface Report {
  id: string;
  type: "spot" | "comment" | "bug";
  title: string;
  description: string;
  spotId?: string; // For spot and comment reports
  commentId?: string; // For comment reports
  createdAt: string;
  status: "open" | "resolved";
}

