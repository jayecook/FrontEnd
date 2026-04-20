import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function getAllProducts() {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
}

export async function getPublicProducts(filters) {
  const params = new URLSearchParams();

  if (filters.productId) params.append("productId", filters.productId);
  if (filters.productType) params.append("productType", filters.productType);
  if (filters.productAmount) params.append("productAmount", filters.productAmount);
  if (filters.productCount) params.append("productCount", filters.productCount);

  const response = await fetch(`${API_URL}/products/public?${params.toString()}`);
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return response.json();
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return response.json();
}

export async function deleteProduct(id) {
  await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE"
  });
}

export async function sendLowStockAlerts() {
  const response = await fetch(`${API_URL}/alerts/send`, {
    method: "POST"
  });
  return response.text();}
