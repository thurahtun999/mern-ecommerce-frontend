import { CardElement , useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import API_URL from "../api.tsx";

type ShippingType = {
    name: string;
    email: string;
    address: string;
    city: string;
};
type CartItem = {
    _id?: string;
    product?: string;
    name: string;
    image?: string;
    price: number;
    quantity?:number;
};

type CheckoutFormProps = {
    cart: CartItem[];
    total: number;
    shipping: ShippingType;
    setCart: React.Dispatch<React.SetStateAction<any[]> >;
};
export default function CheckoutForm({ cart, total, shipping, setCart }:
     CheckoutFormProps)
 {

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

            const token = window.localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }
            if ( 
                !shipping.name ||
                !shipping.email ||
                !shipping.address ||
                !shipping.city 
            ) {
                alert("Please fill all shipping fields");
                return;
            }

            if (!cart || cart.length === 0) {
                alert("Your cart is empty");
                return;
            }
            setLoading(true);

            try {

            const orderPayload = {
                orderItems: cart.map((item: any) => ({
                    name: item.name,
                    price: Number(item.price)|| 0,
                    qty: Number(item.quantity) || 1,
                    image: item.image || "",
                    product: item._id || item.product,
                })),
                shippingInfo: {
                    name: shipping.name,
                    email: shipping.email,
                    address: shipping.address,
                    city: shipping.city,
                },
                paymentMethod: "Card",
                totalPrice: total,
                isPaid: false,
            };
                
            console.log("Order Payload:", orderPayload);

                

                //Create payment intent //
                const orderRes = await fetch(`${API_URL}/api/orders`, 
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderPayload),     
                });
                const data = await orderRes.json();

                const orderId = data.order._id;
                console.log("Order response:", data);

                const paymentRes = await fetch (
                    `${API_URL}/api/stripe/create-payment-intent`,{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            amount: total * 100,
                            orderId: orderId,
                        }),
                    }
                );
                const paymentData = await paymentRes.json();
                const clientSecret = paymentData.clientSecret;

                console.log("Client Secret:", clientSecret);

                const result = await stripe?.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements?.getElement(CardElement)!,
                    },
                });
                if (result?.error){
                    console.log(result?.error.message);
                    alert("Payment failed");
                    return;
                }
                if(result?.paymentIntent.status === "succeeded") {
                    alert("Payment sucessful");

                    localStorage.removeItem("cart");
                    setCart([]);
                    navigate("/orders");

                }

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleSubmit}
        className="checkout-form">

            <h2 className="section-title">Card Details</h2>

            <div className="card-element-box">
                <CardElement />
            </div>

            <button className="primary-btn"
            type="submit" disabled={loading}>
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
        </form>
    );
}
    



    