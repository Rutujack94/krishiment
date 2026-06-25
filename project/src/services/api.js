import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));

    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    // Let axios set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const login = (data) => API.post("/auth/login/", data);
export const register = (data) => API.post("/auth/register/", data);

export const fetchSchemes = () => API.get("/schemes/");
export const fetchPrices = () => API.get("/market/prices/");
export const fetchJobs = () => API.get("/jobs/");
export const fetchEquipment = () => API.get("/equipment/");
export const fetchNotifications = () => API.get("/notifications/");
export const fetchHistory = () => API.get("/history/");

export const createEquipmentListing = (data) =>
  API.post("/equipment/", data);

export const updateEquipmentListing = (id, data) =>
  API.put(`/equipment/${id}/`, data);

export const createJob = (data) => API.post("/jobs/", data);

export const getJobs = () => API.get("/jobs/");

export const getNearbyJobs = () => API.get("/jobs/nearby/");

export const getJob = (id) => API.get(`/jobs/${id}/`);

export const updateJob = (id, data) =>
  API.put(`/jobs/${id}/`, data);

export const deleteJob = (id) =>
  API.delete(`/jobs/${id}/`);

export const applyForJob = (id, data) =>
  API.post(`/jobs/${id}/apply/`, data);

export const getJobApplications = (id) =>
  API.get(`/jobs/${id}/applications/`);

export const respondToApplication = (id, data) =>
  API.post(`/jobs/${id}/respond_to_application/`, data);

export const getLabourCount = (params) =>
  API.get("/jobs/labour_count/", { params });

export const getMyJobApplications = () =>
  API.get("/job-applications/");

export const updateJobApplication = (id, data) =>
  API.put(`/job-applications/${id}/`, data);


export const todosApi = {
  getAll: async () => {
    const response = await API.get("/todos/");
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/todos/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await API.post("/todos/", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await API.put(`/todos/${id}/`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await API.delete(`/todos/${id}/`);
    return response.data;
  },
};

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("BASE_URL =", API.defaults.baseURL);

export default API;