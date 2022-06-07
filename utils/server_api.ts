import axios from "axios";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const SERVER_API = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8;",
  },
  params: {
    api_key: API_KEY,
    language: "ko-KR",
    // regions: "KR"
  },
});

export default SERVER_API;
