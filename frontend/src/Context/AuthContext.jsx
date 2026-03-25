import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safe localStorage handling
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user"); // cleanup corrupted data
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      const userData = res.data.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", userData.token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
