import AuthApi from "api/auth";
import errorHandler from "./error-handler";
import { LoginDto } from "type/dto/auth.dto";

class AuthClient {
  async login(dto: LoginDto): Promise<{ error?: string; name?: string }> {
    try {
      const { email, password } = dto;
      const loginRes = await AuthApi.login(email, password);
      const { name } = loginRes.data;
      return { name };
    } catch (err) {
      errorHandler(err);
    }
  }

  async logout(): Promise<{ error?: string }> {
    await AuthApi.logout();
    localStorage.removeItem("sixteen-persist");
    return {};
  }
}

export const authClient = new AuthClient();
