// src/components/SmartWidgets.tsx
import React from "react";

interface SmartWidgetsProps {
    onSpontaneousClick: () => void;
}

const SmartWidgets: React.FC<SmartWidgetsProps> = ({ onSpontaneousClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-bold">Pick Up Where You Left Off</h4>
                <p className="text-gray-500 mt-2 text-sm">
                    (Widget coming soon)
                </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-bold">Forgotten Gems</h4>
                <p className="text-gray-500 mt-2 text-sm">
                    (Widget coming soon)
                </p>
            </div>
            <div
                className="bg-cyan-600 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-cyan-500 transition"
                onClick={onSpontaneousClick}
            >
                <button className="font-bold text-lg text-white">
                    ✨ Feeling Spontaneous?
                </button>
            </div>
        </div>
    );
};

export default SmartWidgets;
