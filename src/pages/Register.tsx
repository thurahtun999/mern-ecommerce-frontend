import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api.tsx";

function Register() {

    const navigate = useNavigate();

    const [form, setform] = useState({
        name: "",
        email:"",
        password: "",
    });

    const handleChange = (e: any) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!form.name || !form.email|| !form.password) {
            alert ("Please fill all fields");
            return;
        }


        const res = await 
        fetch(`${API_URL}/api/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form),
        });
        
        const data = await res.json();

        if (res.ok) {
            alert("Register successful");

            navigate("/login");

        } else {
            alert(data.message);
        }  
    };
    return (
        <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>

            <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            />

            <input
             name="email"
             placeholder="Email"
            onChange={handleChange} />
            
            <input
            name="password"
             type="password"
             placeholder="Password"
             onChange={handleChange} />

         <button type="submit">
            Register
        </button>
        </form> 
        </div>
    );
}
export default Register;