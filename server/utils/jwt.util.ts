import * as jwt from "jsonwebtoken";
import { CommonError, UnauthorizedException } from "../types/error.type";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { errorMessage } from "../middlewares/error.middleware";
import { getRefreshToken, upsertToken } from "../services/auth.service";
import { UpdateTokenDto } from "../dtos/auth.dto";

const accessEnv = config.jwt.JWT_ACCESS_EXPIRESIN;
const refreshEnv = config.jwt.JWT_REFRESH_EXPIRESIN;

export const verify = async (token: string, secret: string, type: string) => {
  try {
    if (type === "refresh") {
      const refreshData = await getRefreshToken(token);
      if (!refreshData) {
        throw new UnauthorizedException("인증 정보가 없습니다.");
      }
      return { userId: refreshData.userId };
    } else {
      const payload = jwt.verify(token, secret, {
        algorithms: ["HS256"],
      }) as jwt.JwtPayload;
      const { userId } = payload;
      if (userId) {
        return { userId: userId };
      }
    }
  } catch (err) {
    console.error(err);
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException("Token expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedException("Token invalid");
    } else {
      throw new Error("UnExpected");
    }
  }
};

export const createTokens = async (userId: number) => {
  try {
    // 서비스에 따라 추가 가능
    let accessTokenPayload: { userId: string };
    accessTokenPayload = {
      userId: userId.toString(),
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      config.jwt.JWT_ACCESS_SECRET,
      {
        expiresIn: Number(accessEnv),
        audience: "gfax",
        issuer: config.jwt.JWT_ISSUER,
      }
    );
    const refreshTokenPayload = { uuid: uuidv4() };
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      config.jwt.JWT_REFRESH_SECRET,
      {
        expiresIn: Number(refreshEnv),
        audience: "gfax",
        issuer: config.jwt.JWT_ISSUER,
      }
    );
    const upsertData = { userId, refreshToken };
    await upsertToken(userId, refreshToken);
    return { accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    throw new CommonError(
      500,
      errorMessage.INTERNAL_SERVER_ERROR,
      "관리자에게 문의해주세요."
    );
  }
};
