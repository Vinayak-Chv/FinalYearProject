import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;