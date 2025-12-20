import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Note } from "../types";

interface NoteSelectionModalProps {
    notes: Note[];
    onClose: () => void;
    onAnalyze: (selectedNoteIds: string[]) => void;
}

const NoteSelectionModal: React.FC<NoteSelectionModalProps> = ({
    notes,
    onClose,
    onAnalyze,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleToggleNote = (noteId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(noteId)) {
            newSelected.delete(noteId);
        } else {
            newSelected.add(noteId);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === notes.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(notes.map(n => n.id)));
        }
    };

    const handleAnalyze = () => {
        if (selectedIds.size > 0) {
            onAnalyze(Array.from(selectedIds));
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-earth-800 rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in flex flex-col border border-earth-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 mb-2">
                        Select Notes for Analysis
                    </h2>
                    <p className="text-stone-400 text-sm">
                        Choose which notes to send to the LLM for classification. 
                        Selected notes will be analyzed and classified into your hierarchy.
                    </p>
                    
                    {/* Privacy Notice */}
                    <div className="mt-4 p-4 bg-earth-900/50 rounded-lg border border-earth-700">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🔒</span>
                            <div>
                                <p className="text-stone-300 text-sm font-medium mb-1">
                                    Privacy Notice
                                </p>
                                <p className="text-stone-500 text-xs">
                                    Selected notes will be sent to an external LLM service (Groq or OpenAI) 
                                    for analysis. Only the note content you select will be transmitted. 
                                    You can review and edit all classifications before they're added to your app.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-grow overflow-y-auto mb-6">
                    {notes.length === 0 ? (
                        <div className="text-center py-12 text-stone-500">
                            <p>No notes available to analyze.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Select All */}
                            <div className="flex items-center gap-3 pb-3 border-b border-earth-700">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === notes.length && notes.length > 0}
                                    onChange={handleSelectAll}
                                    className="h-5 w-5 rounded bg-earth-700 border-earth-600 text-growth-500 focus:ring-growth-500 cursor-pointer"
                                />
                                <label className="text-stone-300 font-medium cursor-pointer">
                                    Select All ({notes.length} notes)
                                </label>
                            </div>

                            {/* Notes */}
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                        selectedIds.has(note.id)
                                            ? "bg-growth-500/10 border-growth-500/50"
                                            : "bg-earth-900/50 border-earth-700 hover:border-earth-600"
                                    }`}
                                    onClick={() => handleToggleNote(note.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(note.id)}
                                            onChange={() => handleToggleNote(note.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-5 w-5 rounded bg-earth-700 border-earth-600 text-growth-500 focus:ring-growth-500 cursor-pointer mt-0.5 flex-shrink-0"
                                        />
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-semibold text-stone-200 mb-1">
                                                {note.title}
                                            </h3>
                                            <p className="text-stone-400 text-sm line-clamp-2">
                                                {note.content}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-stone-500">
                                                    {note.source === "google_keep" ? "📝 Google Keep" : 
                                                     note.source === "apple_notes" ? "🍎 Apple Notes" : 
                                                     "📄 Manual"}
                                                </span>
                                                {note.metadata?.createdTime && (
                                                    <span className="text-xs text-stone-600">
                                                        • {new Date(note.metadata.createdTime).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-earth-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-earth-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-earth-600 transition-all"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-stone-500 text-sm">
                            {selectedIds.size} selected
                        </span>
                        <button
                            onClick={handleAnalyze}
                            disabled={selectedIds.size === 0}
                            className="px-6 py-2 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NoteSelectionModal;

