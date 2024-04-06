import { loginApi, logoutApi } from "api/auth";
import errorHandler from "./error-handler";

export interface loginParams {
  email: string;
  password: string;
}

class AuthClient {
  async login(
    params: loginParams
  ): Promise<{ error?: string; nickname?: string; role?: string }> {
    try {
      const { email, password } = params;

      const loginRes = await loginApi(email, password);
      console.log("로그인시 확인되는 값: ", loginRes);

      const { nickname, role } = loginRes.data;
      return { nickname, role };
    } catch (err) {
      errorHandler(err);
    }
  }

  async logout(): Promise<{ error?: string }> {
    await logoutApi();
    localStorage.removeItem("sixteen-persist");
    return {};
  }
}

export const authClient = new AuthClient();
