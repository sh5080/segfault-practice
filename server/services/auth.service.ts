import {
  invalidInputError,
  noResultError,
} from "../middlewares/error.middleware";

import { LoginDto } from "../dtos/auth.dto";
import { User } from "type/user.type";
import { UserToken } from "../types/data/user.type";

import bcrypt from "bcrypt";
import { getDBConnection } from "../loaders/db.loader";

export const getUserToLogin = async (dto: LoginDto): Promise<User> => {
  try {
    const connection = await getDBConnection();
    const { email, password } = dto;

    const userQuery = `
    SELECT *
    FROM user
    WHERE email = ?    
    `;
    const [result] = await connection.execute(userQuery, [email]);

    if (!result || !result[0]) {
      noResultError("존재하지 않는 아이디입니다.");
    }
    const userData: User = result[0];
    console.log("#$$#$$", userData);
    const hashedPasswordFromDB = userData.password;
    const passwordMatches = await bcrypt.compare(
      password,
      hashedPasswordFromDB
    );
    if (!passwordMatches) {
      invalidInputError("비밀번호가 일치하지 않습니다.");
    }

    return userData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRefreshToken = async (token: string): Promise<UserToken> => {
  try {
    const connection = await getDBConnection();

    const query = `
    SELECT *
    FROM user_token
    WHERE refresh_token = :token    
    `;

    const [result] = await connection.execute(query, [token]);

    if (!result) {
      noResultError("getRefreshToken: 조회된 결과가 없습니다.");
    }
    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upsertToken = async (userId: number, refreshToken: string) => {
  try {
    const connection = await getDBConnection();
    const checkQuery = `
    SELECT *
    FROM user_token
    WHERE user_id = :userId
  `;
    const [checkResult] = await connection.execute(checkQuery, [userId]);

    if (!checkResult) {
      noResultError("upsertToken: 조회된 결과가 없습니다.");
    }
    const updateQuery = `
    UPDATE user_token
    SET refresh_token = :refreshToken
    WHERE id = :userId
  `;
    await connection.execute(updateQuery, [refreshToken, userId]);

    return refreshToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
