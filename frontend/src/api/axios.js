import axios from "axios";

const api = axios.create({
  baseURL: "https://wheels-peka.onrender.com",
  withCredentials: true,
});

export default api;
