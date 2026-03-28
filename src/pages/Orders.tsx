import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api.tsx";

type OrderItemType = {
    name: string;
    price: number;
    qty: number;
    image?: string;
};

type OrderType = {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    isDelivered: boolean;
    createdAt?: string;
    orderItems?: OrderItemType[];
    shippingInfo?: {
        name?: string;
        email?: string;
        address?: string;
        city?: string;
    };
};


export default function Order() {
    console.log("RENDER");

    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 500);
        return () => clearTimeout(timer);
}, [keyword]);

    useEffect(() => {
    const fetchOrders = async () => {
        
        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }
            
            let url = "";

            if (debouncedKeyword?.trim()) {

                url = `${API_URL}/api/orders/search?keyword=
                ${debouncedKeyword}&page=${page}`;

            } else {
                
                url = `${API_URL}/api/orders/myorders?page=${page}`;
            }
            console.log("URL:", url);

            const res = await fetch(url, {
                 headers: {
                        Authorization: `Bearer ${token}`,
                 }
            });
                
    
                const data = await res.json();
                console.log("My Orders:", data);

                if (!res.ok){
                    alert(data.message || "Failed to fetch orders");
                    return;
                }

                if (Array.isArray(data)) {
                    setOrders(data);
                    setPages(1);
                } else {
                    setOrders(data.orders || []);
                    setPages(data.pages || 1);
                }

        } catch (error) {
            console.log("Fetch Orders Error:", error);
        } finally {
            setLoading(false);
        }
    };
      fetchOrders();
    }, [page, debouncedKeyword]);
   
   

    return (
        <div className="page-container">
            <div className="orders-wrapper">
                <h1 className="page-title"> Orders</h1>

                {loading && <p className= "title">Loading...</p>}

                <input
                    type="text"
                    placeholder="Search orders..."
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setPage(1);
                    }}
                    className="search" />

            {orders.length === 0 && !loading ? (
                    <div className="empty-box">
                        <p className="empty-text">No orders yet</p>
                        <button 
                        className="primary-btn" onClick={() =>
                            navigate("/")}>
                                Go Shopping
                            </button>
                            </div>
                 ) : (

                    orders.map((order) => (
                        <div key={order._id}
                        className="order-card">
                            <p><strong>Order ID:</strong>{order._id}</p>
                            <p><strong>Total:</strong>${order.totalPrice}</p>
                            <p><strong>PaymentStatus:</strong>{order.paymentStatus}</p>
                            <p><strong>Delivered:</strong>{order.isDelivered ?
                            "Yes" : "No"}</p>
                            <p><strong>Shipping:</strong>{order.shippingInfo?.name ||
                            "No name"} / {""} {order.shippingInfo?.email ||
                                "No email"}</p>
                            <p><strong>Address:</strong>{order.shippingInfo?.address ||
                            "No address"}{""} {order.shippingInfo?.city || 
                                "No City"}</p>

                                <div className="items-box">
                                    <strong>Items:</strong>
                                    {order.orderItems && order.orderItems.length> 0 ? (
                                        order.orderItems.map((item, index) =>(
                                            <div key={index}
                                            className="order-item-row">
                                                <p>
                                                    {item.name} - $
                                                    {item.price} x {item.qty}

                                                </p>
                                            </div>
                                        ))

                                    ) : (
                                        <p>No items</p>
                                    )}
                                    </div>

                                 </div>
                        ))                 
                )}
            </div>
            <div className="pagination">
                {[...Array(pages).keys()].map((x) => (
                    <button
                    key={x}
                    onClick={() => setPage(x + 1)}
                    className="stepage" > 
                    {x + 1}
                    </button>
                ))}
            </div>
        </div>
           
    );
};


