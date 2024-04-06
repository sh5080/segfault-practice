import { errorCode, errorMessage } from "../middlewares/error.middleware";
import { CommonError } from "../types/error.type";

export class LoginDto {
  readonly email: string;
  readonly password: string;

  constructor(email: string, password: string) {
    this.validateEmail(email);
    this.email = email;
    this.validatePw(password);
    this.password = password;
  }

  private validateEmail(email: string) {
    if (!email) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        "이메일은 필수 입력값입니다."
      );
    }
  }
  private validatePw(password: string) {
    if (!password) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        "패스워드는 필수 입력값입니다."
      );
    }
  }
}
export class RefreshTokenDto {
  readonly refreshToken: string;

  constructor(refreshToken: string) {
    this.validateToken(refreshToken);
    this.refreshToken = refreshToken;
  }

  private validateToken(refreshToken: string) {
    if (!refreshToken) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        "리프레시 토큰은 필수 입력값입니다."
      );
    }
  }
}

export class UpdateTokenDto extends RefreshTokenDto {
  readonly userId: number;

  constructor(userId: number, refreshToken: string) {
    super(refreshToken);
    this.validateUserId(userId);
    this.userId = userId;
  }

  private validateUserId(userId: number) {
    if (!userId) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        "userId는 필수 입력값입니다."
      );
    }
  }
}
