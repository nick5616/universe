import React from "react";

const SmartWidgets = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TODO: Make these widgets functional */}
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-bold">Pick Up Where You Left Off</h4>
                <ul className="list-disc list-inside text-gray-400 mt-2">
                    <li>Stickers</li>
                    <li>Music Mashups</li>
                </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-bold">Forgotten Gems</h4>
                <p className="text-gray-400 mt-2">
                    Remember the 'Portfolio App' idea?
                </p>
            </div>
            <div className="bg-cyan-600 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-cyan-500 transition">
                <button className="font-bold text-lg">
                    ✨ Feeling Spontaneous?
                </button>
            </div>
        </div>
    );
};

export default SmartWidgets;
