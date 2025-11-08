import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-cyan-400">Universe</h1>
                <p className="text-gray-400">
                    Your personal dashboard for ideas and projects.
                </p>
            </header>
            <main>
                <Dashboard />
            </main>
        </div>
    );
}

export default App;
