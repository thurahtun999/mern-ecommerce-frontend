import { Link, useNavigate } from "react-router-dom";

type Props = {
    cartCount: number;
};

const Navbar = ({ cartCount }: Props) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    return (
        <nav className="navbar">
           
            <Link to="/">Home</Link>
            <Link to="/cart">
            Cart ({cartCount})
            </Link>

             {token? (
                <>
                <Link to="/orders">Orders</Link>
                <button onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }}>
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link to="/login">Login</Link>
                <Link to="register">Register</Link>
                </>
            )}
            <Link to="/orders">Orders</Link>
            <Link to="/admin/orders">Admin</Link>
             <Link to="/admin/products">AdminPorducts</Link>
            <Link to="/admin/dashboard">AdminDashboard</Link>
            

        </nav>
    );
};
export default Navbar;
