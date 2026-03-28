import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api.tsx";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
};

function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    
    useEffect(() => {

        fetch(`${API_URL}/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setProduct(data);
        });
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="product-detail">
            <img src={product.image} width="80%" alt={product.name}/>
            

            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p>{product.description}</p>
        </div>
    );
}
export default ProductDetail;