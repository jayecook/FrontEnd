import { useState, useEffect, useMemo, useCallback } from 'react'
import "../styles/ProductPageStyle.css";

const API = "http://localhost:8081/products";
const TYPES = ["Material", "Safety", "Equipment"];

const initialForm = { 
  product_name: "", 
  product_description: "", 
  product_price: "", 
  product_type: "Material", 
  product_count: "",
  threshold: ""
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCount, setSearchCount] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("id"); // Default: Product ID

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const normalizedProducts = data.map((product) => ({
        ...product,
        product_type:  product.product_type ?? "",
        product_count: Number(product.product_count ?? 0),
        threshold:     Number(product.threshold ?? 0),   // NEW
      }));

      setProducts(normalizedProducts);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return null;
    const num = parseFloat(priceStr);
    return isNaN(num) ? null : Math.round(num * 100) / 100;
  };

  const handleSubmit = async () => {
    if (!form.product_name.trim())        return showToast("Name is required", "error");
    if (!form.product_count)              return showToast("Count is required", "error");
    if (!form.product_type.trim())        return showToast("Type is required", "error");
    if (!form.product_price)              return showToast("Price is required", "error");
    if (!form.product_description.trim()) return showToast("Description is required", "error");
    if (form.threshold === "")            return showToast("Threshold is required", "error");  // NEW

    const payload = {
      product_name:        form.product_name.trim(),
      product_description: form.product_description.trim(),
      product_price:       parsePrice(form.product_price),
      product_type:        form.product_type,
      product_count:       parseInt(form.product_count, 10),
      threshold:           parseInt(form.threshold, 10),    // NEW
    };

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      await fetchProducts();
      setForm(initialForm);
      setEditingId(null);
      showToast(editingId ? "Product updated!" : "Product added!");
    } catch (err) {
      showToast(`Operation failed: ${err.message}`, "error");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.product_id);
    setForm({
      product_name:        product.product_name        || "",
      product_description: product.product_description || "",
      product_price:       product.product_price       ?? "",
      product_type:        product.product_type        || "Material",
      product_count:       product.product_count       ?? "",
      threshold:           product.threshold           ?? "",  // NEW
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product_id) => {
    try {
      const res = await fetch(`${API}/${product_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchProducts();
      setDeleteConfirm(null);
      showToast("Product deleted");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const filteredProducts = useMemo(() => {
  return products
    .filter((product) => {
      const nameValue      = product.product_name?.toLowerCase() || "";
      const idValue        = String(product.product_id ?? "");
      const countValue     = String(product.product_count ?? "");
      const thresholdValue = String(product.threshold ?? "");
      const typeValue      = product.product_type || "";

      // Primary search box targets whichever field is selected in sortBy
      let matchesMainSearch = true;
      if (searchTerm.trim() !== "") {
        if (sortBy === "id")             matchesMainSearch = idValue.includes(searchTerm.trim());
        else if (sortBy === "name")      matchesMainSearch = nameValue.includes(searchTerm.toLowerCase().trim());
        else if (sortBy === "count")     matchesMainSearch = countValue.includes(searchTerm.trim());
        else if (sortBy === "threshold") matchesMainSearch = thresholdValue.includes(searchTerm.trim());
      }

      // Secondary search box targets count normally, but threshold when in threshold mode
      const secondaryValue = sortBy === "threshold" ? thresholdValue : countValue;
      const matchesSecondarySearch =
        searchCount.trim() === "" || secondaryValue.includes(searchCount.trim());

      const matchesType =
        filterType === "all" || typeValue === filterType;

      return matchesMainSearch && matchesSecondarySearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "id")        return (a.product_id ?? 0) - (b.product_id ?? 0);
      if (sortBy === "name")      return (a.product_name || "").localeCompare(b.product_name || "");
      if (sortBy === "count")     return (a.product_count ?? 0) - (b.product_count ?? 0);
      if (sortBy === "threshold") return (a.threshold ?? 0) - (b.threshold ?? 0);
      return 0;
    });
}, [products, searchTerm, searchCount, filterType, sortBy]);

  return (
    <>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-tag">inventory system</div>
          <h1>Products</h1>
          <div className="header-sub">Manage your product catalog</div>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-filter-bar">
        <div className="search-group">
            <input
            type="text"
            placeholder={`Search by ${sortBy === 'id' ? 'Product ID' : sortBy === 'name' ? 'Name' : sortBy === 'count' ? 'Count' : 'Threshold'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <input
            type="number"
            placeholder={sortBy === "threshold" ? "Search by threshold" : "Search by count"}
            value={searchCount}
            onChange={e => setSearchCount(e.target.value)}
        />
        <div className="filter-group">
            <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
            >
            <option value="all">All Types</option>
            {TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
            ))}
            </select>
        </div>
        <div className="sort-group">
            <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="count">Sort by Count</option>
            <option value="threshold">Sort by Threshold</option>
            </select>
        </div>
        </div>

        {/* Form */}
        <div className="form-card">
          <div className={`form-title ${editingId !== null ? 'editing' : ''}`}>
            <span />
            {editingId !== null ? `Editing product #${editingId}` : 'Add new product'}
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Product name"
                value={form.product_name}
                onChange={e => setForm({ ...form, product_name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div className="field">
              <label>Count</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.product_count}
                onChange={e => setForm({ ...form, product_count: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Threshold</label>    {/* NEW */}
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.threshold}
                onChange={e => setForm({ ...form, threshold: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Type</label>
              <select
                value={form.product_type}
                onChange={e => setForm({ ...form, product_type: e.target.value })}
              >
                {TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.product_price}
                onChange={e => setForm({ ...form, product_price: e.target.value })}
              />
            </div>

            <div className="field full">
              <label>Description</label>
              <textarea
                placeholder="Product description..."
                value={form.product_description}
                onChange={e => setForm({ ...form, product_description: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingId !== null ? 'Save Changes' : 'Add Product'}
            </button>
            {editingId !== null && (
              <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            )}
          </div>
        </div>

        {/* List Header */}
        <div className="list-header">
          <h2>Catalog</h2>
          <span className="count-badge">
            {filteredProducts.length} of {products.length} items
          </span>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="loading">
            <span className="loading-dot">▪</span>
            <span className="loading-dot">▪</span>
            <span className="loading-dot">▪</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p>No products match your filters. Try adjusting search or type filter.</p>
          </div>
        ) : (
          <div className="product-list">
            {filteredProducts.map((product, i) => (
              <div
                key={product.product_id}
                className={`product-card ${editingId === product.product_id ? 'editing-active' : ''}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="product-id">#{product.product_id}</div>

                <div className="product-main">
                  <div className="product-name">{product.product_name}</div>
                  <div className="product-type">{product.product_type}</div>
                  <div className="product-desc">{product.product_description || '—'}</div>
                </div>

                <div className="product-stats">
                  <div className="product-count">
                    <span className="count-label">Count: </span>
                    <span className="count-value">{product.product_count}</span>
                  </div>
                  <div className="product-threshold">        {/* NEW */}
                    <span className="count-label">Threshold: </span>
                    <span className="count-value">{product.threshold}</span>
                  </div>
                  <div className={`product-price ${product.product_price == null ? 'null-price' : ''}`}>
                    {product.product_price != null ? `$${product.product_price.toFixed(2)}` : 'N/A'}
                  </div>
                </div>

                <div className="product-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => setDeleteConfirm(product)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete product?</h3>
            <p>"{deleteConfirm.product_name}" ({deleteConfirm.product_type}) will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.product_id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </>
  );
}

export default App;