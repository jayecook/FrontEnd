import React, { useEffect, useState } from "react";
import { getPublicProducts } from "../api/productApi";
import SearchFilters from "./SearchFilters";

function PublicInventoryPage({ onBack }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    productId: "",
    productType: "",
    productAmount: "",
    productCount: ""
  });

  const loadProducts = async (activeFilters = filters) => {
    const data = await getPublicProducts(activeFilters);
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadProducts(filters);
  };

  const handleClear = async () => {
    const cleared = { productId: "", productType: "", productAmount: "", productCount: "" };
    setFilters(cleared);
    await loadProducts(cleared);
  };

  return (
    <div className="card wide">
      <h2>Browse Inventory</h2>
      <SearchFilters
        filters={filters}
        onChange={handleChange}
        onSearch={handleSearch}
        onClear={handleClear}
        onBack={onBack}
      />

      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Type</th>
            <th>Amount</th>
            <th>Count</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productType}</td>
              <td>${product.productAmount}</td>
              <td>{product.productCount}</td>
              <td>{product.threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PublicInventoryPage;
