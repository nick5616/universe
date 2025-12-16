/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                earth: {
                    900: "#1c1917",
                    800: "#292524",
                    700: "#44403c",
                },
                passion: {
                    400: "#e879f9",
                    500: "#d946ef",
                    600: "#c026d3",
                },
                growth: {
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a",
                },
            },
            fontFamily: {
                serif: ["Lora", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [],
};
