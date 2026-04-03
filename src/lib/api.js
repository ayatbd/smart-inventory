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

export const inventoryAPI = {
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },
  addProduct: async (productData) => {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return res.json();
  },
  restock: async (id, quantity) => {
    const res = await fetch(`${API_URL}/products/${id}/restock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },
};

export const orderAPI = {
  getOrders: async () => {
    const res = await fetch(`${API_URL}/orders`);
    return res.json();
  },
  createOrder: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return res.json(); // This will return { success: true } or { message: "Error..." }
  },
  updateStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};

export const restockAPI = {
  // ... (previous calls)
  getRestockData: async () => {
    const res = await fetch(`${API_URL}/dashboard-stats`);
    return res.json();
  },
  restock: async (id, quantity) => {
    const res = await fetch(`${API_URL}/products/${id}/restock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },
};

export const activityAPI = {
  // Fetch logs (We'll reuse the dashboard-stats or create a dedicated one)
  getActivities: async () => {
    const res = await fetch(`${API_URL}/dashboard-stats`);
    const data = await res.json();
    return data.activities; // Returns the array of logs
  },
};
