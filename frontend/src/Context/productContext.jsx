import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"

const ProductContext = createContext()

export const productProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios("http://localhost:3000/api/products")
                setProducts(data)
            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <ProductContext.Provider value={{ products, loading }}>
            {children}
        </ProductContext.Provider>
    )

}

export default useProducts = () => useContext(ProductContext) 