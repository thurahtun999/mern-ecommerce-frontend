import { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import API_URL from "../api.tsx";

export default function login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from|| "/";

    const [email, steEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await
        fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
            alert(data.message || "Login failed");

        return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user",
            JSON.stringify({
                email: data.email,
                role: data.role
            }));
             
       

        navigate(from);
        
         alert("Login successful");
    };


    return (
        <div>
        <h2>Login</h2>

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => steEmail(e.target.value)} />

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>
        Login
        </button>
        </div>
    );
}