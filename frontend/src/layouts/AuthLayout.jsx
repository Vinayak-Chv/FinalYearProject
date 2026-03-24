import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;