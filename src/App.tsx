import { useState, useEffect } from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  const [cart, setCart] = useState<any[]>(() => { 
    const savedCart = localStorage.getItem("cart");
    return savedCart ?
    JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQty= (id: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          return {...item, quantity:
            (item.quantity || 1) + 1 };
        }
        return item;
      })
    );
   };

   const decreaseQty = (id: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          return {...item, quantity:
            Math.max((item.quantity || 1) - 1, 1)};
        }
        return item;
      })
    );
   };

  const addToCart = (product: any) => {
    const existing = cart.find((item) =>
      item.id === product.id);

    if (existing) {
      increaseQty(product.id);
   } else {
    setCart([...cart, { ...product, quantity: 1 }]);
   }
  };

   const removeFromCart = (id: number) => {
    setCart(cart.filter ((item) => item.id !== id));
   };

  return (
    <>
    <Navbar cartCount={cart.length} />

    <Routes>
      <Route path="/" element={<Home  addToCart={addToCart} />} />
      <Route 
      path="/cart"
       element={<Cart
        cart={cart} 
      removeFromCart={removeFromCart} 
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      />
    } 
    />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart}/>} />
      <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
     
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders />
      </AdminRoute>}
       />
       <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard />
       </AdminRoute>} />
    
      <Route path="/admin/products" element={<AdminRoute><AdminProducts />
      </AdminRoute>} />
      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes> 
    </>
  );
}


export default App;
