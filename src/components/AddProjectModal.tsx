import { useState } from "react";
import { createPortal } from "react-dom";

interface AddProjectModalProps {
    onClose: () => void;
    onSave: (name: string, domain: string, description: string) => void;
    initialDomain?: string;
    availableDomains?: string[];
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
    onClose,
    onSave,
    initialDomain,
    availableDomains = ["Art", "Code", "Music", "Content Creation"],
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [domain, setDomain] = useState<string>(initialDomain || "Code");
    const [isCustomDomain, setIsCustomDomain] = useState(
        !availableDomains.includes(initialDomain || "")
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && domain.trim()) {
            onSave(name.trim(), domain.trim(), description.trim());
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
                        <div className="flex gap-2">
                            {!isCustomDomain ? (
                                <select
                                    id="projectDomain"
                                    value={domain}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "__custom__") {
                                            setIsCustomDomain(true);
                                            setDomain("");
                                        } else {
                                            setDomain(value);
                                        }
                                    }}
                                    className="flex-1 bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent p-3 outline-none transition-all"
                                >
                                    {availableDomains.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                    <option value="__custom__">
                                        + Custom Domain
                                    </option>
                                </select>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        id="projectDomain"
                                        value={domain}
                                        onChange={(e) =>
                                            setDomain(e.target.value)
                                        }
                                        placeholder="Enter domain name"
                                        className="flex-1 bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent p-3 outline-none transition-all"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomDomain(false);
                                            if (availableDomains.length > 0) {
                                                setDomain(availableDomains[0]);
                                            }
                                        }}
                                        className="px-3 py-2 bg-earth-700 rounded-lg text-stone-300 hover:bg-earth-600 transition-all text-sm"
                                        title="Use existing domain"
                                    >
                                        ←
                                    </button>
                                </>
                            )}
                        </div>
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
