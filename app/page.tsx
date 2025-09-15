"use client";

import { useState } from "react";
import IncidentForm from "../components/IncidentForm";
import ReportDisplay from "../components/ReportDisplay";

export default function Home() {
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setReport("");
    setError(null);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(
          errorData.error || `API request failed: ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let accumulatedReport = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        console.log("Received chunk:", chunk);
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              accumulatedReport += content;
              setReport(accumulatedReport);
            } else if (parsed.error) {
              console.error("Stream error:", parsed.error);
              setError(`Stream error: ${parsed.error}`);
              setReport("");
            }
          } catch (e) {
            console.error("Parse error:", e, "Raw data:", data);
            setError("Failed to parse streamed data");
            setReport("");
          }
        }
      }
      console.log("Final report:", accumulatedReport);
      if (!accumulatedReport) {
        setError("No report content received");
      }
    } catch (error: any) {
      console.error("Error generating report:", error);
      setError(error.message || "Error generating report. Please try again.");
      setReport("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport("");
    setError(null);
  };

  const handleUpdate = (updatedReport: string) => {
    setReport(updatedReport);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-200">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 bg-gray-400 py-4 text-center mb-6 width-full">
        Incident Report Generator
      </h1>

      {/* Divs */}
      <div className="flex flex-col md:flex-row justify-around mt-2">

        <div className="max-w-lg w-full">
          <IncidentForm onSubmit={handleSubmit} />
        </div>

        <div className="max-w-lg w-full">
          <ReportDisplay
            report={report}
            onReset={handleReset}
            onUpdate={handleUpdate}
          />
          {isLoading && (
            <div className="text-center text-blue-600 font-medium mt-6">
              Generating report...
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 font-medium mb-6">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
