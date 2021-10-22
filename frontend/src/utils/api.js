import axios from "axios";
import store from "../store";
import { logout } from "../actions/userActions";

// const URL = "/api/";

const api = axios.create({
//   baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "appication/json",
  },
});

// request interceptor to add the auth token header to requests
// api.interceptors.request.use(
//   (config) => {
//     config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
//     return config;
//   },
//   (err) => {
//     Promise.reject(err);
//   }
// );

// response interceptor to refresh token on receiving expired token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err);
    }

    if (
      err.response.status === 401 &&
      err.response.statusText === "Unauthorized"
    ) {
      store.dispatch(logout());
    }
  }
);

export default api;
