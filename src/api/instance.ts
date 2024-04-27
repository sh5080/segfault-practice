import axios, { AxiosInstance, AxiosResponse } from "axios";
import { paths } from "route/path";

import {
  ClientError,
  DefaultAxiosError,
  RequestTimeoutException,
  ServerError,
} from "../type/error.type";

class ApiManager {
  private static defaultInstance: AxiosInstance;
  private static imageInstance: AxiosInstance;

  static initializeInstances(options?: any): void {
    this.defaultInstance = this.createInstance({ ...options });
    this.imageInstance = this.createInstance({
      ...options,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  private static createInstance(options?: any): AxiosInstance {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      ...options,
      withCredentials: true,
    });

    instance.defaults.timeout = 10000;

    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: DefaultAxiosError) => {
        if (error.code === "ERR_NETWORK") {
          throw new ServerError(
            `서버에 연결할 수 없습니다. \n인터넷 상태를 확인해주세요.`
          );
        }
        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          throw new RequestTimeoutException(
            `요청시간이 초과되었습니다. \n지속될 경우 관리자에게 문의해주세요.`
          );
        }
        if (error.response.data.message === "로그인이 필요합니다.") {
          window.location.href = paths.auth.signIn;
        }
        const errData = error.response.data;
        if (errData.statusCode === 401) {
          const user = { name: null };
          localStorage.setItem("segfault-persist", JSON.stringify({ user }));

          throw new ClientError("로그인후 이용 가능합니다.");
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }

  static default(): AxiosInstance {
    if (!this.defaultInstance) {
      throw new Error("Default instance is not initialized.");
    }
    return this.defaultInstance;
  }

  static image(): AxiosInstance {
    if (!this.imageInstance) {
      throw new Error("Image instance is not initialized.");
    }
    return this.imageInstance;
  }
}
ApiManager.initializeInstances();
export default ApiManager;
