import axios from "axios";
import getConfig from "next/config";

const CAConnectionInstance = axios.create({
  timeout: 20000,
  baseURL: "http://localhost:4000",
});

const { publicRuntimeConfig } = getConfig();

export default axios.create({
  baseURL: publicRuntimeConfig.apiURl,
});

CAConnectionInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { CAConnectionInstance };
