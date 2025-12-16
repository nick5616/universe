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
                    Plant a New Seed
                </h2>
                <p className="text-stone-400 mb-6">
                    What's the next idea you want to nurture?
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="projectName"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                            placeholder="e.g., My Awesome App"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="projectDesc"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Description{" "}
                            <span className="text-stone-500">(Optional)</span>
                        </label>
                        <textarea
                            id="projectDesc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all resize-none"
                            placeholder="What is this project about?"
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            htmlFor="projectDomain"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Domain
                        </label>
                        <select
                            id="projectDomain"
                            value={domain}
                            onChange={(e) =>
                                setDomain(e.target.value as Domain)
                            }
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                        >
                            <option>Art</option>
                            <option>Code</option>
                            <option>Music</option>
                            <option>Content Creation</option>
                        </select>
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
                            Plant Seed
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddProjectModal;
