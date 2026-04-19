import React, { useEffect, useState } from "react";
import { createProduct, deleteProduct, getAllProducts, sendLowStockAlerts, updateProduct } from "../api/productApi";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (product) => {
    if (editingProduct) {
      await updateProduct(editingProduct.productId, product);
      setMessage("Product updated.");
      setEditingProduct(null);
    } else {
      await createProduct(product);
      setMessage("Product created.");
    }
    await loadProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setMessage("Product removed.");
    await loadProducts();
  };

  const handleSendAlerts = async () => {
    const response = await sendLowStockAlerts();
    setMessage(response);
  };

  return (
    <div className="card wide">
      <div className="header-row">
        <h2>Admin Dashboard</h2>
        <div className="button-row">
          <button onClick={handleSendAlerts}>Send Alerts</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <ProductForm
        editingProduct={editingProduct}
        onSave={handleSave}
        onCancel={() => setEditingProduct(null)}
      />

      {message && <p className="success">{message}</p>}

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminDashboard;
