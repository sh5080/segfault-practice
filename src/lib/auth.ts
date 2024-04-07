import { loginApi, logoutApi, signupApi } from "api/auth";
import errorHandler from "./error-handler";
import { LoginDto, SignupDto } from "type/dto/auth.dto";

class AuthClient {
  async login(dto: LoginDto): Promise<{ error?: string; name?: string }> {
    try {
      const { email, password } = dto;

      const loginRes = await loginApi(email, password);
      console.log("로그인시 확인되는 값: ", loginRes);

      const { name } = loginRes.data;
      return { name };
    } catch (err) {
      errorHandler(err);
    }
  }

  async logout(): Promise<{ error?: string }> {
    await logoutApi();
    localStorage.removeItem("sixteen-persist");
    return {};
  }
  async signup(dto: SignupDto): Promise<{ error?: string; name?: string }> {
    try {
      const { name, email, password } = dto;

      const signupRes = await signupApi(name, email, password);
      console.log("로그인시 확인되는 값: ", signupRes);

      const data = signupRes.data;
      return data;
    } catch (err) {
      errorHandler(err);
    }
  }
}

export const authClient = new AuthClient();
