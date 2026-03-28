import { Link } from "react-router-dom";

type Props = {
    cart: any[];
    removeFromCart: (index: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
};

function Cart({ cart, removeFromCart, increaseQty, decreaseQty  }: Props)  {
    const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart.</p>

            </div>
        );

    }

    return (
        <div>
            {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                    <img src={item.image}width= "80" alt={item.ame} />

                    <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <p>Qty: {item.quantity}</p>

                    <button onClick={() => decreaseQty(item.id)}> 
                        -
                         </button>
                        <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item.id)}>
                         +
                          </button>

                    <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}>
                        Remove
                    </button>
                    </div>
                    </div>
            ))}

            <h2> Total: ${total.toFixed(2)}</h2>

            <Link to="/checkout">
            <button className="checkout-btn">
                Proceed to Checkout
            </button>
            
            </Link>

        </div>
    );
};

export default Cart;