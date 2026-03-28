import { useEffect, useState } from "react";
import API_URL from "../api.tsx";
import axios from "axios";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
   // Cell,
} from "recharts";


export default function AdminDashboard () {

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        paidOrders: 0,
        pendingOrders: 0,
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
            setLoading(true);

            const token = localStorage.getItem("token"); 
            
            const res = await axios.get(`${API_URL}/api/orders/stats`, {
                headers: {
                    Authorization: "Bearer " + token,
                },

             });
              
            setStats(res.data);

        } catch (error){
            console.log("Dashboard error:",error);

            
        } finally {
            setLoading(false);
        }
    };
        fetchStats();

    }, []);
    
    if (loading) return <p 
    className="loading-text">Loading...</p>;

    const salesData = [
        { name: "Jan", sales: 200 },
        { name: "Feb", sales: 400 },
        { name: "Mar", sales: 300 },
        { name: "Apr", sales: 600 },
    ];

    const orderData = [
        {name: "Paid", value: stats.paidOrders },
        { name: "Pending", value: stats.pendingOrders },

    ];

    return(
        <div className="dashboard">
            <h2 className="title">Dashboard</h2>

            {loading && <p className= "title">Loading...</p>}

            <div className="grid">
                <div className="card">
                    <h3>Total Orders:</h3>
                    <p>{stats.totalOrders}</p>
                </div>

                <div className="card">
                    <h3>Total Sales</h3>
                    <p>${stats.totalSales}</p>
                    
                </div>

                <div className="card paid">
                    <h3>Paid Orders</h3>
                    <p>{stats.paidOrders}</p>
                </div>

                <div className="card pending">
                    <h3>Pending Orders</h3>
                    <p>{stats.pendingOrders}</p>
                </div>
            </div>

            <div className="grid">

                <div className="card chart">
                    <h3>Sales Overview</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone"
                            dataKey="sales" />                  
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart">
                    <h3>Orders Status</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie  
                            data={orderData}
                            dataKey="value"
                            outerRadius={100}
                            label   
                            >
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>

                </div>
            </div>
        </div>
    );
}