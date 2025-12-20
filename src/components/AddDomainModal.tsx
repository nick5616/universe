// src/components/AddDomainModal.tsx
import { useState } from "react";
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
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-earth-800 rounded-2xl p-8 w-full max-w-md border border-earth-700 animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold font-serif text-stone-100 mb-2">
                    Create Domain
                </h2>
                <p className="text-stone-400 mb-6">
                    Add a new domain to organize your projects.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label
                            htmlFor="domainName"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Domain Name
                        </label>
                        <input
                            type="text"
                            id="domainName"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                            placeholder="e.g., Writing, Design, Business"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-earth-700 rounded-lg text-sm font-semibold text-stone-300 hover:bg-earth-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all shadow-lg"
                        >
                            Create Domain
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddDomainModal;
