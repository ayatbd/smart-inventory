// lib/api.js
const API_URL = "http://localhost:5000";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  signup: async (email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // Note: Ensure your backend has this exact route or change to /dashboard-stats
  getStats: () => fetch(`${API_URL}/dashboard-stats`).then((res) => res.json()),

  getProducts: () => fetch(`${API_URL}/products`).then((res) => res.json()),

  // FIXED: Removed ": any"
  createOrder: (orderData) =>
    fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    }).then((res) => res.json()),

  // FIXED: Removed ": any"
  addProduct: (productData) =>
    fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    }).then((res) => res.json()),
};
