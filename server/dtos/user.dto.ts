import {
  errorCode,
  errorMessage,
  requiredInputError,
} from "../middlewares/error.middleware";
import { CommonError } from "../types/error.type";

export class SignupDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  constructor(name: string, email: string, password: string) {
    this.validateName(name);
    this.validateEmail(email);
    this.validatePassword(password);

    this.name = name;
    this.email = email;
    this.password = password;
  }

  private validateName(name: string) {
    if (!name) {
      requiredInputError("이름은 필수 입력값입니다.");
    }
  }

  private validateEmail(email: string) {
    if (!email) {
      requiredInputError("이메일 주소는 필수 입력값입니다.");
    }
    // 이메일 유효성 검사
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        "유효하지 않은 이메일 주소입니다."
      );
    }
  }

  private validatePassword(password: string) {
    if (!password) {
      requiredInputError("패스워드는 필수 입력값입니다.");
    }
  }
}
