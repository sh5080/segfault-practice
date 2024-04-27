import {
  invalidInputError,
  noResultError,
} from "../middlewares/error.middleware";
import { getDBConnection } from "../loaders/db.loader";

import { User, UserProfile } from "../model/user.model";
import { SignupDto } from "../dtos/user.dto";
import bcrypt from "bcrypt";

export const createUser = async (dto: SignupDto): Promise<User> => {
  try {
    const { name, email, password } = dto;
    const connection = await getDBConnection();
    const userExistsQuery = `
    SELECT COUNT(*)
    FROM user
    WHERE email = :email    
    `;
    const [existingUserResult] = await connection.execute(userExistsQuery, [
      email,
    ]);
    const existingUserCount: number = existingUserResult[0]["COUNT(*)"];

    if (existingUserCount > 0) {
      invalidInputError("해당 이메일은 이미 사용 중입니다.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO user (name, email, password)
      VALUES (?, ?, ?)
    `;

    // 사용자 추가
    await connection.execute(insertUserQuery, [name, email, hashedPassword]);

    const newUserQuery = `
      SELECT *
      FROM user
      WHERE email = :email
    `;
    // 새로운 사용자 정보 조회
    const [newUserResult] = await connection.execute(newUserQuery, [email]);
    const newUser: User = newUserResult[0];

    if (!newUser) {
      throw new Error("사용자 생성에 실패했습니다.");
    }

    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserByUserId = async (userId: number): Promise<User> => {
  try {
    const connection = await getDBConnection();

    const query = `
    SELECT *
    FROM user
    WHERE id = :userId    
    `;

    const [result] = await connection.execute(query, [userId]);

    if (!result) {
      noResultError("조회된 결과가 없습니다.");
    }
    const userData: User = result[0];
    return userData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    const connection = await getDBConnection();

    const query = `
    SELECT *
    FROM user_profile
    WHERE user_id = :userId    
    `;

    const [result] = await connection.execute(query, [userId]);

    if (!result) {
      noResultError("조회된 결과가 없습니다.");
    }
    const userProfileData: UserProfile = result[0];
    return userProfileData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
