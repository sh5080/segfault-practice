import {
  invalidInputError,
  noResultError,
} from "../middlewares/error.middleware";
import { mysqlDB } from "../loaders/db.loader";
import { QueryTypes } from "sequelize";
import { LoginDto, UpdateTokenDto } from "../dtos/auth.dto";
import { User } from "type/user.type";
import { UserToken } from "../types/data/user.type";

import bcrypt from "bcrypt";

export const getUserToLogin = async (dto: LoginDto): Promise<User> => {
  try {
    const { email, password } = dto;

    const userQuery = `
      SELECT *
      FROM user
      WHERE email = :email
    `;
    const userData: User[] = await mysqlDB.query(userQuery, {
      type: QueryTypes.SELECT,
      replacements: { email },
    });
    if (!userData || userData.length === 0) {
      noResultError("존재하지 않는 아이디입니다.");
    }

    const hashedPasswordFromDB = userData[0].password;
    const passwordMatches = await bcrypt.compare(
      password,
      hashedPasswordFromDB
    );
    if (!passwordMatches) {
      invalidInputError("비밀번호가 일치하지 않습니다.");
    }

    return userData[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRefreshToken = async (token: string): Promise<UserToken> => {
  try {
    const query = `
    SELECT *
    FROM user_token
    WHERE refresh_token = :token    
    `;

    const data: UserToken[] = await mysqlDB.query(query, {
      type: QueryTypes.SELECT,
      replacements: { token },
    });
    if (!data || data.length === 0) {
      noResultError("getRefreshToken: 조회된 결과가 없습니다.");
    }
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upsertToken = async (userId: number, refreshToken: string) => {
  try {
    const checkQuery = `
    SELECT *
    FROM user_token
    WHERE user_id = :userId
  `;
    const checkResult: UserToken[] = await mysqlDB.query(checkQuery, {
      type: QueryTypes.SELECT,
      replacements: { userId },
    });

    if (!checkResult || checkResult.length === 0) {
      noResultError("upsertToken: 조회된 결과가 없습니다.");
    }
    const updateQuery = `
    UPDATE user_token
    SET refresh_token = :refreshToken
    WHERE id = :userId
  `;
    await mysqlDB.query(updateQuery, {
      replacements: { userId, refreshToken },
    });

    return refreshToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
