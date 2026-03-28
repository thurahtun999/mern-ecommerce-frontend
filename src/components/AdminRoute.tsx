import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export default function AdminRoute({children }: Props) {
    const token= localStorage.getItem("token");

    const userString  = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if(!token || user?.role !== "admin") {return <Navigate to="/login" />; }
    
    

    return children;
}