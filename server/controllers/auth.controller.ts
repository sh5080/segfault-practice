import { NextFunction, Request, Response } from "express";
import {
  isSuccess,
  successCode,
  successMessage,
} from "../middlewares/error.middleware";

import { LoginDto } from "../dtos/auth.dto";

import { UnauthorizedException } from "../types/error.type";
import { createTokens } from "../utils/jwt.util";
import config from "../config";
import { getUserToLogin } from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const loginDto = new LoginDto(email, password);
    const userData = await getUserToLogin(loginDto);

    if (userData && userData.id) {
      const tokens = await createTokens(userData.id);
      const accessEnv = config.jwt.JWT_ACCESS_EXPIRESIN;
      const refreshEnv = config.jwt.JWT_REFRESH_EXPIRESIN;

      const now = new Date();
      const accessExp = new Date(now.getTime() + accessEnv * 1000);
      const refreshExp = new Date(now.getTime() + refreshEnv * 1000);
      const accessOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
      } = {
        expires: accessExp,
        httpOnly: true,
      };
      const refreshOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
      } = {
        expires: refreshExp,
        httpOnly: true,
      };
      if (process.env.NODE_ENV === "production") {
        accessOptions.secure = true;
        refreshOptions.secure = true;
      }
      res
        .cookie("access", tokens.accessToken, accessOptions)
        .cookie("refresh", tokens.refreshToken, refreshOptions)
        .status(successCode.OK)
        .json(isSuccess(successCode.OK, successMessage.LOGIN_SUCCESS));
    } else {
      throw new UnauthorizedException("회원정보와 일치하지 않습니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
