import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Project } from "../lib/mockData";

interface AddResponsibilityModalProps {
    onClose: () => void;
    onSave: (
        projectId: number,
        responsibilityName: string,
        frequencyHours: number
    ) => void;
    projects: Project[];
    initialProjectId?: number;
}

const AddResponsibilityModal: React.FC<AddResponsibilityModalProps> = ({
    onClose,
    onSave,
    projects,
    initialProjectId,
}) => {
    const [responsibilityName, setResponsibilityName] = useState("");
    const [frequencyHours, setFrequencyHours] = useState("24");
    const [selectedProjectId, setSelectedProjectId] = useState<number>(
        initialProjectId || (projects.length > 0 ? projects[0].id : 0)
    );

    useEffect(() => {
        if (initialProjectId) {
            setSelectedProjectId(initialProjectId);
        } else if (projects.length > 0 && selectedProjectId === 0) {
            setSelectedProjectId(projects[0].id);
        }
    }, [initialProjectId, projects]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (responsibilityName.trim() && selectedProjectId) {
            const hours = parseInt(frequencyHours) || 24;
            if (hours > 0) {
                onSave(selectedProjectId, responsibilityName.trim(), hours);
                onClose();
            }
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
                    Add New Responsibility
                </h2>
                <p className="text-stone-400 mb-6">
                    Add a recurring responsibility to track.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="responsibilityName"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Responsibility Name
                        </label>
                        <input
                            type="text"
                            id="responsibilityName"
                            value={responsibilityName}
                            onChange={(e) =>
                                setResponsibilityName(e.target.value)
                            }
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                            placeholder="e.g., Take medication"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="frequencyHours"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Frequency (hours)
                        </label>
                        <input
                            type="number"
                            id="frequencyHours"
                            value={frequencyHours}
                            onChange={(e) => setFrequencyHours(e.target.value)}
                            min="1"
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                            placeholder="24"
                            required
                        />
                        <p className="text-xs text-stone-500 mt-1">
                            How often should this be completed? (e.g., 24 for
                            daily, 12 for twice daily)
                        </p>
                    </div>
                    <div className="mb-8">
                        <label
                            htmlFor="projectSelect"
                            className="block mb-2 text-sm font-medium text-stone-300"
                        >
                            Project
                        </label>
                        <select
                            id="projectSelect"
                            value={selectedProjectId}
                            onChange={(e) =>
                                setSelectedProjectId(Number(e.target.value))
                            }
                            className="bg-earth-900 border border-earth-700 text-stone-100 text-sm rounded-lg focus:ring-2 focus:ring-passion-500 focus:border-transparent block w-full p-3 outline-none transition-all"
                            required
                        >
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name} ({project.domain})
                                </option>
                            ))}
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
                            Add Responsibility
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddResponsibilityModal;

