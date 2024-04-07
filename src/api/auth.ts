import { AxiosResponse } from "axios";
import { LoginResponse } from "type/response.type";

import ApiManager from "./instance";

ApiManager.initializeInstances();
const defaultUrl = "auth";

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> =
      await ApiManager.default().post(`/${defaultUrl}/login`, {
        email,
        password,
      });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logoutApi = async () => {
  try {
    const response = await ApiManager.default().delete(`/${defaultUrl}/logout`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const signupApi = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await ApiManager.default().post(`/${defaultUrl}/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
