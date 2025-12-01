import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-cyan-400">Universe</h1>
                <p className="text-gray-400">
                    Your personal dashboard for ideas and projects.
                </p>
            </header>
            <main className="flex-grow">
                <Dashboard />
            </main>
            <Footer />
        </div>
    );
}

export default App;
