import { AxiosResponse } from "axios";
import { LoginResponse } from "type/response.type";
import ApiManager from "./instance";
import { SignupDto } from "type/dto/auth.dto";

export default class UserApi {
  private static defaultUrl = "user";

  static async signup(dto: SignupDto): Promise<LoginResponse> {
    try {
      const { name, email, password, passwordConfirm } = dto;
      const response: AxiosResponse<LoginResponse> =
        await ApiManager.default().post(`/${this.defaultUrl}/signup`, {
          name,
          email,
          password,
          passwordConfirm,
        });
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
