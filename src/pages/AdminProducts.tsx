import { useEffect, useState } from "react";
import API_URL from "../api.tsx";

type Product = {
    id: string;
     name?: string;
     price?: number;
     category?: string;
     description?: string;
     image?: string;
     stock?: number;
};

 export default function AdminProducts() {

    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [image, setImage] = useState<File | null> (null);


    const handleImageChange = (e: 
        React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files &&
                e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                }
            };
    

    const fetchProducts = async () => {
        const res = await
        fetch(`${API_URL}/api/products`);
        const data = await res.json();
        console.log(data);
        setProducts(data.products);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async () => {
        console.log("ID:", editingId);
        const token = localStorage.getItem("token");

         const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("stock", stock);

        if (image) {
            formData.append("image", image);
        }
        
        const url = editingId ?
        `${API_URL}/api/products/${editingId}`:
        `${API_URL}/api/products`;

        const method = editingId ? "PUT": "POST";

        console.log("Final URL:", url);
        console.log("editingId:", editingId);


        const res = await fetch(url,
            {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
            
            const data = await res.json();
            console.log("Server Response:", data);
            if(editingId) {
           setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? 
            data : p))
    ); 
} else {
    setProducts((prev) => [...prev, data]);
} 
    
            setName("");
            setPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setEditingId(null);

            fetchProducts();
    };
    const deleteProduct = async (id: string) => {
        if (!window.confirm("Delete this product?")) return;
        const token = localStorage.getItem("token");

        const res = await
        fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.message || "Delete failed");
            return;
        }
        
        alert("Product deleted");
        fetchProducts();
    
    }
    return (
        <div>
            <h2>Admin Products</h2>

            {/* Add Produdct Form */}

            <input
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
                setName(e.target.value)}
                />

            <input
            placeholder="Price"
            value={price}
            onChange={(e) =>
                setPrice(e.target.value)}
                />

            <input
            placeholder="Description"
            value={description}
            onChange={(e) =>
                setDescription(e.target.value)}
                />

            <input
            placeholder="Category"
            value={category}
            onChange={(e) =>
                setCategory(e.target.value)}
                />

            <input
            placeholder="Stock"
            value={stock}
            onChange={(e) =>
                setStock(e.target.value)}
                />

            <label htmlFor="image">Product Image</label>
            <input 
            id="image"
            type="file"
            onChange={handleImageChange}
            />
            

                <button onClick={addProduct}>
                    {editingId? "Update Product": "Add Product"} 
                    </button>

                    <hr />

                    {/* Product List */}

            { products?.map((product) => (
                <div key={product.id}
                className="product-card">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock}</p>

                    <img 
                    src={product.image}
                    alt={product.name}
                    width="120px" />

                    <button
                    onClick={() => {
                        setEditingId(product.id);
                        setName(product.name || "");
                        setPrice((product.price ?? 0).toString());
                        setDescription(product.description || "");
                        setCategory(product.category || "");
                        setStock((product.stock ?? 0).toString());
                        
                    }} >
                        Edit
                    </button>

                    <button onClick={() => 
                        deleteProduct(product.id)}>
                    Delete
                    </button>
                </div>
            ))}

            </div>
            
    );
};
