import React from "react";
import Index from "./routes/Index";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Index />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
