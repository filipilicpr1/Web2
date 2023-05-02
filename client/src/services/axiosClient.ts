import axios from "axios";

const createAxiosClient = (options: any) => {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config: any) => {
      if (config.authorization !== false) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
}

export const axiosClient = createAxiosClient({headers: {}});