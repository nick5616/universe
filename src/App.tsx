import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-passion-400 via-passion-500 to-growth-400 bg-clip-text text-transparent">
                    Passionfruit
                </h1>
                <p className="text-stone-400 mt-3 text-lg">
                    Nurture your ideas, from seed to fruit.
                </p>
            </header>
            <main>
                <Dashboard />
            </main>
        </div>
    );
}

export default App;
