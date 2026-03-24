import Index from "./routes/Index";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./Context/productContext";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Index />
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
