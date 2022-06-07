import axios from "axios";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2EwZjBhMmFlMjEwOWQ5Y2U5ZTM4MzMxMTc0MTA4NCIsInN1YiI6IjYyOTZmZjU0Y2RkYmJjMTMwZWVlOWM2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gqtpFtfryILufzKKzWd1hctu_4CGNJx146qCnyakZwo";
const API_KEY = "f7a0f0a2ae2109d9ce9e383311741084";

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
