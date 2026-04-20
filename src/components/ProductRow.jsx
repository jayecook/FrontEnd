import React from "react";

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr>
      <td>{product.productId}</td>
      <td>{product.productType}</td>
      <td>${product.productAmount}</td>
      <td>{product.productCount}</td>
      <td>{product.threshold}</td>
      <td>
        <button onClick={() => onEdit(product)}>Update</button>
        <button className="danger" onClick={() => onDelete(product.productId)}>Remove</button>
      </td>
    </tr>
  );
}

export default ProductRow;
