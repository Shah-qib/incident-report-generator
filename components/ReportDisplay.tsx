"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface ReportDisplayProps {
  report: string;
  //onReset: () => void;
  onUpdate?: (updatedReport: string) => void;
}

export default function ReportDisplay({
  report,
  //onReset,
  onUpdate,
}: ReportDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState(report);

  useEffect(() => {
    setEditedReport(report);
  }, [report]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedReport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Incident Report", 20, 20);
    const splitText = doc.splitTextToSize(editedReport, 170);
    doc.text(splitText, 20, 30);
    doc.save("incident-report.pdf");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(editedReport);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedReport(e.target.value);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-500">
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4 width-full">
        Generated Report
      </h2>
      <div className="bg-gray-100 p-4 rounded-lg min-h-[140px]">
        {report ? (
          isEditing ? (
            <textarea
              value={editedReport}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm font-mono text-left"
              rows={6}
              maxLength={1000}
              placeholder="Edit your report..."
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-900 text-left">
              {editedReport}
            </pre>
          )
        ) : (
          <p className="text-gray-500 italic text-sm text-center">
            Report will appear here...
          </p>
        )}
      </div>
      {report && (
        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
          >
            Download PDF
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="flex-1 bg-yellow-600 text-white py-2.5 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold"
            >
              Edit
            </button>
          )}
        </div>
      )}
      {/* {report && (
        <button
          onClick={onReset}
          className="w-full bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
        >
          New Report
        </button>
      )} */}
    </div>
  );
}
