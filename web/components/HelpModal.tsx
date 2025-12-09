"use client";

import { useState, useEffect } from "react";
import { Report } from "@/types/report";
import { getAllReports, saveReport, deleteReport, generateReportId } from "@/utils/reportStorage";

interface HelpModalProps {
  onClose: () => void;
  initialReportType?: "spot" | "comment" | "bug";
  spotId?: string;
  commentId?: string;
}

export default function HelpModal({
  onClose,
  initialReportType,
  spotId,
  commentId,
}: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<"report" | "reports">("report");
  const [reportType, setReportType] = useState<"spot" | "comment" | "bug">(
    initialReportType || "bug"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (initialReportType) {
      setReportType(initialReportType);
      setActiveTab("report");
    }
    loadReports();
  }, [initialReportType]);

  const loadReports = () => {
    const allReports = getAllReports();
    setReports(allReports);
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(reportId);
      loadReports();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    const newReport: Report = {
      id: generateReportId(),
      type: reportType,
      title: title.trim(),
      description: description.trim(),
      spotId: spotId,
      commentId: commentId,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    saveReport(newReport);
    loadReports();
    setTitle("");
    setDescription("");
    setActiveTab("reports");
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Help & Reports</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "report"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "reports"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active Reports ({reports.filter((r) => r.status === "open").length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "report" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Report Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportType("spot")}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      reportType === "spot"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Report a Spot
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType("comment")}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      reportType === "comment"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Report a Comment
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType("bug")}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      reportType === "bug"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Report a Bug
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a brief title for your report"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide details about your report..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No reports yet. Submit a report to get started.
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 relative"
                  >
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl font-bold transition-colors"
                      title="Delete report"
                    >
                      ×
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              report.type === "spot"
                                ? "bg-green-600/30 text-green-400"
                                : report.type === "comment"
                                ? "bg-yellow-600/30 text-yellow-400"
                                : "bg-red-600/30 text-red-400"
                            }`}
                          >
                            {report.type === "spot"
                              ? "Spot"
                              : report.type === "comment"
                              ? "Comment"
                              : "Bug"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              report.status === "open"
                                ? "bg-blue-600/30 text-blue-400"
                                : "bg-gray-600/30 text-gray-400"
                            }`}
                          >
                            {report.status === "open" ? "Open" : "Resolved"}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">
                          {report.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{report.description}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

