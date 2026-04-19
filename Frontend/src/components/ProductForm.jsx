import React, { useEffect, useState } from "react";

function ProductForm({ editingProduct, onSave, onCancel }) {
  const [form, setForm] = useState({
    productId: "",
    productType: "",
    productAmount: "",
    productCount: "",
    threshold: ""
  });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        productId: editingProduct.productId,
        productType: editingProduct.productType,
        productAmount: editingProduct.productAmount,
        productCount: editingProduct.productCount,
        threshold: editingProduct.threshold
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      productId: Number(form.productId),
      productType: form.productType,
      productAmount: Number(form.productAmount),
      productCount: Number(form.productCount),
      threshold: Number(form.threshold)
    });
    setForm({
      productId: "",
      productType: "",
      productAmount: "",
      productCount: "",
      threshold: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="productId" placeholder="Product ID" value={form.productId} onChange={handleChange} />
      <input name="productType" placeholder="Product Type" value={form.productType} onChange={handleChange} />
      <input name="productAmount" placeholder="Product Amount" value={form.productAmount} onChange={handleChange} />
      <input name="productCount" placeholder="Product Count" value={form.productCount} onChange={handleChange} />
      <input name="threshold" placeholder="Threshold" value={form.threshold} onChange={handleChange} />
      <div className="button-row">
        <button type="submit">{editingProduct ? "Update" : "Create"}</button>
        {editingProduct && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
