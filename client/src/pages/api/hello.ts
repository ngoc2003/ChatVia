import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const CAConnectionInstance = axios.create({
  timeout: 20000,
  baseURL: publicRuntimeConfig.BASE_API,
});

CAConnectionInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { CAConnectionInstance };
