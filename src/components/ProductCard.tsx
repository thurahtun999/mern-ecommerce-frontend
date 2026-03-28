import { Link } from "react-router-dom";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
};

type Props = {
    product: Product;
    addToCart: (product: Product) => void;
};

const ProductCard = ({ product, addToCart }: Props) => {
    return (
        <div className="product-card">
        
            <Link to={`/product/${product.id}`}>
            
            <img src={product.image}
            alt={product.name}
            className="product-image" />
            </Link>

            <h3>{product.name}</h3>
            <p className="price"> ${product.price} </p>
            <button className="add-cart-btn"
            onClick={() => addToCart(product)} >
                Add to Cart
                </button>
        </div>
    );
};
export default ProductCard;