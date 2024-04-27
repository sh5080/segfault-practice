import { AxiosResponse } from "axios";
import { LoginResponse } from "type/response.type";
import ApiManager from "./instance";

export default class AuthApi {
  private static defaultUrl = "auth";

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log("email: ", email, password);
      const response: AxiosResponse<LoginResponse> =
        await ApiManager.default().post(`/${this.defaultUrl}/login`, {
          email,
          password,
        });
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async logout() {
    try {
      const response = await ApiManager.default().delete(
        `/${this.defaultUrl}/logout`
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
