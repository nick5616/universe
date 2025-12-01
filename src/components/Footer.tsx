import React, { useRef } from "react";
import { dataService } from "../services/dataService";

const Footer = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        try {
            const projects = await dataService.getProjects();
            const domains = await dataService.getDomains();

            const exportData = {
                projects,
                domains,
                exportedAt: new Date().toISOString(),
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `universe-export-${
                new Date().toISOString().split("T")[0]
            }.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("Failed to export data. Please try again.");
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // Validate the imported data structure
            if (!importData.projects || !Array.isArray(importData.projects)) {
                throw new Error("Invalid import file: missing projects array");
            }
            if (!importData.domains || !Array.isArray(importData.domains)) {
                throw new Error("Invalid import file: missing domains array");
            }

            // Import projects
            localStorage.setItem(
                "universe-projects",
                JSON.stringify(importData.projects)
            );

            // Import domains
            localStorage.setItem(
                "universe-domains",
                JSON.stringify(importData.domains)
            );

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Reload the page to reflect the imported data
            window.location.reload();
        } catch (error) {
            console.error("Failed to import data:", error);
            alert(
                `Failed to import data: ${
                    error instanceof Error
                        ? error.message
                        : "Invalid file format"
                }`
            );

            // Reset file input on error
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <footer className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-semibold hover:bg-cyan-500 transition"
                >
                    Export Data
                </button>
                <button
                    onClick={handleImportClick}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
                >
                    Import Data
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />
            </div>
        </footer>
    );
};

export default Footer;
