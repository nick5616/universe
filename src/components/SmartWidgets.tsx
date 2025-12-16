import React from "react";

interface SmartWidgetsProps {
    onSpontaneousClick: () => void;
}

const SmartWidgets: React.FC<SmartWidgetsProps> = ({ onSpontaneousClick }) => {
    return (
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
    );
};

export default SmartWidgets;
