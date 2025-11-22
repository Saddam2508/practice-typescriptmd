import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {}
);
