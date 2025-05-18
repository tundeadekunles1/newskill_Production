import axios from "axios";

const api = axios.create({
  baseURL: "https://newskill-bridge.vercel.app/api",
});

export default api;
