import React from "react";
import ProductRow from "./ProductRow";

function ProductList({ products, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Type</th>
          <th>Amount</th>
          <th>Count</th>
          <th>Threshold</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow
            key={product.productId}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;
