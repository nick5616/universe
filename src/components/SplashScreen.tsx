import React, { useState, useEffect } from "react";

interface SplashScreenProps {
    isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Add a small delay before starting fade-out
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [isLoading]);

    if (!isLoading && !isVisible) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-earth-900 to-stone-900 transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div className="text-center animate-fade-in">
                {/* Animated Logo/Icon */}
                <div className="mb-8 relative flex items-center justify-center">
                    <div className="text-7xl md:text-8xl animate-pulse-slow relative z-10">
                        🌱
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-growth-500/30 animate-ping"></div>
                    </div>
                </div>

                {/* App Title */}
                <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-passion-400 via-passion-500 to-growth-400 bg-clip-text text-transparent mb-3">
                    Passionfruit
                </h1>

                {/* Subtitle */}
                <p className="text-stone-400 text-lg md:text-xl mb-8">
                    Nurture your ideas, from seed to fruit.
                </p>

                {/* Loading Indicator */}
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-growth-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-passion-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-growth-500 rounded-full animate-bounce"></div>
                </div>

                {/* Loading Text */}
                <p className="text-stone-500 mt-6 text-sm animate-pulse">
                    Tending your garden...
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;

