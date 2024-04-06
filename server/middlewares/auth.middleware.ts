import { NextFunction, Request, Response } from "express";
import config from "../config";
import { errorCode, errorMessage } from "./error.middleware";
import { CommonError, UnauthorizedException } from "../types/error.type";
import { createTokens, verify } from "../utils/jwt.util";
import { AuthRequest } from "../types/request.type";

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.cookie) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }
    let accessToken;
    let refreshToken;
    try {
      console.log("header log:::::@", req.headers);
      if (req.headers?.cookie) {
        const cookies = req.headers.cookie.split("; ");
        for (const cookie of cookies) {
          if (cookie.startsWith("access=")) {
            accessToken = cookie.substring(7);
          } else if (cookie.startsWith("refresh=")) {
            refreshToken = cookie.substring(8);
          }
        }
      }
      if (!accessToken && refreshToken) {
        throw new UnauthorizedException("access 토큰이 확인되지 않았습니다.");
      }

      const accessSecret = config.jwt.JWT_ACCESS_SECRET;
      const accessData = await verify(accessToken!, accessSecret, "access");
      if (accessData) {
        req.user = { userId: accessData.userId };
        next();
      }
    } catch (err) {
      if (!refreshToken) {
        throw new UnauthorizedException(
          "토큰이 유효하지 않습니다. 유효한 토큰을 제공해주세요."
        );
      }

      try {
        // ******* access 는 없고 refresh만 있는 상태 ***********
        // access토큰 만료되었을 때 새로운 access토큰 발급
        if (err instanceof UnauthorizedException) {
          const refreshSecret = config.jwt.JWT_REFRESH_SECRET;
          const refreshData = await verify(
            refreshToken,
            refreshSecret,
            "refresh"
          );
          if (!refreshData) {
            throw new UnauthorizedException("refresh토큰 관련 에러");
          }
          const newTokens = await createTokens(refreshData.userId);
          req.user = { userId: refreshData.userId };

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
            .cookie("access", newTokens.accessToken, accessOptions)
            .cookie("refresh", newTokens.refreshToken, refreshOptions);
          return next();
        } else throw err;
      } catch (err) {
        // console.error(err);
        //refresh토큰 검증 후
        res.clearCookie("access");
        res.clearCookie("refresh");
        if (err instanceof UnauthorizedException) {
          throw new UnauthorizedException(
            "유효하지 않은 토큰입니다. 유효한 토큰을 제공해주세요."
          );
        }
        //refresh 토큰이 expired 이외의 오류일 경우 전부 500으로 접근거부에러
        throw new CommonError(
          errorCode.INTERNAL_SERVER_ERROR,
          errorMessage.INTERNAL_SERVER_ERROR,
          "접근 거부"
        );
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
