// Report Storage - Handles saving and loading reports
// Currently uses browser localStorage (data stays in browser only)

import { Report } from "@/types/report";

const STORAGE_KEY = "spotvault_reports";

/**
 * Get all reports from storage
 */
export function getAllReports(): Report[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading reports from storage:", error);
    return [];
  }
}

/**
 * Save a report to storage
 */
export function saveReport(report: Report): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const reports = getAllReports();
    reports.push(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error("Error saving report to storage:", error);
  }
}

/**
 * Get reports by status
 */
export function getReportsByStatus(status: "open" | "resolved"): Report[] {
  const reports = getAllReports();
  return reports.filter((r) => r.status === status);
}

/**
 * Delete a report from storage
 */
export function deleteReport(reportId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const reports = getAllReports();
    const filtered = reports.filter((r) => r.id !== reportId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting report from storage:", error);
  }
}

/**
 * Generate a unique ID for a new report
 */
export function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

