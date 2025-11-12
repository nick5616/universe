// src/components/AddProjectModal.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Domain } from "../lib/mockData";

interface AddProjectModalProps {
    onClose: () => void;
    onSave: (name: string, domain: Domain, description: string) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [domain, setDomain] = useState<Domain>("Code");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), domain, description.trim());
        }
    };

    return createPortal(
        // ... (modal backdrop and wrapper div remain the same)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black opacity-70" />
            <div
                className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">
                    Chart a New Constellation
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="projectName"
                            className="block mb-2 text-sm font-medium text-gray-300"
                        >
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="projectDesc"
                            className="block mb-2 text-sm font-medium text-gray-300"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="projectDesc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="projectDomain"
                            className="block mb-2 text-sm font-medium text-gray-300"
                        >
                            Domain
                        </label>
                        <select
                            id="projectDomain"
                            value={domain}
                            onChange={(e) =>
                                setDomain(e.target.value as Domain)
                            }
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                        >
                            <option>Art</option>
                            <option>Code</option>
                            <option>Music</option>
                            <option>Content Creation</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 rounded-lg text-sm font-bold hover:bg-gray-500 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-bold hover:bg-cyan-500 transition"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddProjectModal;
