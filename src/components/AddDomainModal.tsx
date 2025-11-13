// src/components/AddDomainModal.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface AddDomainModalProps {
    onClose: () => void;
    onSave: (domain: string) => void;
}

const AddDomainModal: React.FC<AddDomainModalProps> = ({ onClose, onSave }) => {
    const [domain, setDomain] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (domain.trim()) {
            onSave(domain.trim());
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black opacity-70" />
            <div
                className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">Add New Domain</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="domainName"
                            className="block mb-2 text-sm font-medium text-gray-300"
                        >
                            Domain Name
                        </label>
                        <input
                            type="text"
                            id="domainName"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            placeholder="e.g., Writing, Design, Business"
                            required
                        />
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
                            Add Domain
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddDomainModal;
