import Index from "./routes/Index";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./Context/productContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <Index />
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
