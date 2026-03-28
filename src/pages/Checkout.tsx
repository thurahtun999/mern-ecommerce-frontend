import { useState } from "react";
import {loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51T8KQu7QscnGLSlDraDr5Yz8inFTMcoM9lB9MgQf9Eb1rK5qEqyyL7Z27faMxfhaCbhX7SzXFILuZALi7DFn5KFV00MVOqhnI7")

type CartItem = {
    _id: string;
    name: string;
    price: number;
    product?: string;
    quantity?: number;
    image?: string;
}
type CheckoutProps = {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<any[]> >;
};
export default function Checkout({cart, setCart}: CheckoutProps ) {

    const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
});

 
const total = cart.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity   || 1);
}, 0);


    return (
        <div className="page-container">
            <div className="card-box">
            <h1
            className="page_title">Checkout</h1>

            <p className="total-text">Total: ${total.toFixed(2)}</p>

            <h2 className="section-title">Shipping Info</h2>

            <input 
            className="form-input"
            type="text"
            placeholder="Name"
            value={shipping.name}
            onChange={(e) =>
                setShipping({ ...shipping, name: e.target.value})} />
            
             <input 
            className="form-input"
            type="email"
            placeholder="Email"
            value={shipping.email}
            onChange={(e) =>
                setShipping({ ...shipping, email: e.target.value})} />

             <input 
            className="form-input"
            type="text"
            placeholder="Address"
            value={shipping.address}
            onChange={(e) =>
                setShipping({ ...shipping, address: e.target.value})} />
            

            <input 
            className="form-input"
            type="text"
            placeholder="City"
            value={shipping.city}
            onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value})} />

                <Elements stripe={stripePromise}>
                    <CheckoutForm cart={cart}
                    total={total} shipping={shipping} setCart={setCart} />
                </Elements>
            </div>
            </div>
    );
}
