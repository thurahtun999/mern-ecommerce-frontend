import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import API_URL from "../api.tsx";

type Props = {
    addToCart: (product: any) => void;
};
function Home ({ addToCart }: Props) {

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any>([]);

    useEffect(() => {
        setLoading(true);
        const getProducts = async () => {
            const res = await
            fetch(`${API_URL}/api/products`);
            const data = await res.json();
            console.log(data);
            setProducts(data.products);
        };
        
        getProducts();
        setLoading(false);
    }, []);

    if (loading) return <p 
    className="loading-text">Loading...</p>;

    return (
        <div>  
            <h1> Products</h1>
            {loading && <p className= "title">Loading...</p>}
            
            <div className="product-grid">
               {products.map((product: any) => (
                <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                />
               ))};
               </div>;

        </div>

    );
}

export default Home;