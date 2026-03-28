import { useEffect, useState } from "react";
import API_URL from "../api.tsx";

type Order = {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    isDelivered: boolean;
    user:{
        email:string;
    }
    orderItems: {
        name: string;
        price: number;
        qty: number;
    } [];
};

 export default function AdminOrders() {

    const [loading, setLoading] = useState(false);

    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async() =>{
        setLoading(true);

         const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/orders`,
                { 
                    headers: { Authorization: "Bearer " + token,
                    },
                });
                const data = await res.json();

                
                setOrders(data.orders || []);

                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (Array.isArray(data.orders)) {
                    setOrders(data.orders);
                } else {
                    setOrders([]);

                }
                setLoading(false);
                
    };
     
        const markDelivered = async (id: string) => {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/orders/${id}/deliver`, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if (res.ok) {
                alert ("Updated!");
                fetchOrders();
            } else {
                alert("Failed!")
            }
           
        };
        useEffect(() => {
            fetchOrders();
        }, [])
        return (
        <div className="Containter">
            <h2 className= "title"> Admin Orders</h2>

            {loading && <p className= "title">Loading...</p>}

             {!loading && orders.length === 0 && <p className= "title">
               No orders</p>}
        
            { orders && orders.map((order) => (
                <div key={order._id}
                className="order-card">
                    <div className="order-header">
                        <h4>Order ID: {order._id}</h4>
                        <span
                        className={order.isDelivered ? 
                            "status-done" : "status-pending"}>
                                {order.isDelivered ?
                                "delivered" : "pending"}
                            </span>
                            </div>
                            <p><b>User:</b> {order.user?.email}</p>
                            <p><b>Total:</b> ${order.totalPrice}</p>

                            <p className={order.paymentStatus ===
                                "paid" ? "paid" : "pending"}>
                                    PaymentStatus: {order.paymentStatus === "paid" ?
                                    "Paid" : "Pending"}
                                
                                </p>

                            <div className="items">
                            {order.orderItems.map((item, i) => (
                        <div key={i} className="order-item">
                            {item.name} - $ {item.price} x {item.qty}
                            </div>
                    ))}
                    </div>
                             
                    {!order.isDelivered && (
                        <button onClick={() =>
                            markDelivered(order._id)}>
                                Mark Delivered
                            </button>
                    )}

                   
                </div>
            ))};

            </div>
    );
};
