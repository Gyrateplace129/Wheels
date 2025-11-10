import axios from "axios";

const api = axios.create({
  baseURL: "https://wheels-9og0.onrender.com/api",
  withCredentials: true,
});

export default api;
