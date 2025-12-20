import React from "react";

interface SmartWidgetsProps {
    onSpontaneousClick: () => void;
    onImportNotes: () => void;
    onContextualizeNotes: () => void;
    hasNewNotes: boolean;
    onExportBackup: () => void;
    onImportBackup: () => void;
}

const SmartWidgets: React.FC<SmartWidgetsProps> = ({
    onSpontaneousClick,
    onImportNotes,
    onContextualizeNotes,
    hasNewNotes,
    onExportBackup,
    onImportBackup,
}) => {
    return (
        <div className="w-full max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-earth-800/50 backdrop-blur-sm p-5 rounded-xl border border-earth-700">
                    <h4 className="font-bold font-serif text-stone-200">
                        Pick Up Where You Left Off
                    </h4>
                    <p className="text-stone-500 mt-2 text-sm italic">
                        (Coming soon)
                    </p>
                </div>
                <div className="bg-earth-800/50 backdrop-blur-sm p-5 rounded-xl border border-earth-700">
                    <h4 className="font-bold font-serif text-stone-200">
                        Dormant Seeds
                    </h4>
                    <p className="text-stone-500 mt-2 text-sm italic">
                        (Coming soon)
                    </p>
                </div>
                <div
                    className="bg-gradient-to-br from-passion-500 to-passion-600 p-5 rounded-xl flex items-center justify-center cursor-pointer hover:from-passion-400 hover:to-passion-500 transition-all duration-300 shadow-lg hover:shadow-passion-500/30 group"
                    onClick={onSpontaneousClick}
                >
                    <button className="font-bold text-lg text-white group-hover:scale-105 transition-transform">
                        🌱 Feeling Spontaneous?
                    </button>
                </div>
            </div>

            {/* Import Actions - Fixed width matching grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <button
                    onClick={onImportNotes}
                    className="bg-earth-800/50 backdrop-blur-sm p-5 rounded-xl border border-earth-700 hover:border-growth-500/50 transition-all duration-300 text-left group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                            📥
                        </span>
                        <div>
                            <h4 className="font-bold font-serif text-stone-200">
                                Import Notes
                            </h4>
                            <p className="text-stone-500 text-sm mt-1">
                                Bulk import from Google Keep or Apple Notes
                            </p>
                        </div>
                    </div>
                </button>

                {hasNewNotes && (
                    <button
                        onClick={onContextualizeNotes}
                        className="bg-gradient-to-br from-growth-500/20 to-growth-600/20 p-5 rounded-xl border-2 border-growth-500/50 hover:border-growth-500 transition-all duration-300 text-left group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                ✨
                            </span>
                            <div>
                                <h4 className="font-bold font-serif text-stone-200">
                                    Contextualize New Notes
                                </h4>
                                <p className="text-stone-500 text-sm mt-1">
                                    Analyze and classify new notes
                                </p>
                            </div>
                        </div>
                    </button>
                )}
            </div>

            {/* JSON Backup Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <button
                    onClick={onExportBackup}
                    className="bg-earth-800/50 backdrop-blur-sm p-5 rounded-xl border border-earth-700 hover:border-growth-500/50 transition-all duration-300 text-left group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                            💾
                        </span>
                        <div>
                            <h4 className="font-bold font-serif text-stone-200">
                                Export Backup
                            </h4>
                            <p className="text-stone-500 text-sm mt-1">
                                Download a JSON backup of all your data
                            </p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={onImportBackup}
                    className="bg-earth-800/50 backdrop-blur-sm p-5 rounded-xl border border-earth-700 hover:border-growth-500/50 transition-all duration-300 text-left group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                            📤
                        </span>
                        <div>
                            <h4 className="font-bold font-serif text-stone-200">
                                Import Backup
                            </h4>
                            <p className="text-stone-500 text-sm mt-1">
                                Restore from a JSON backup file
                            </p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SmartWidgets;
