import { CommonError } from "../types/error.type";
import {
  errorCode,
  errorMessage,
  invalidInputError,
  noResultError,
} from "../middlewares/error.middleware";
import { mysqlDB } from "../loaders/db.loader";
import { QueryTypes } from "sequelize";
import { User } from "type/user.type";
import { SignupDto } from "../dtos/user.dto";

export const createUser = async (dto: SignupDto): Promise<User> => {
  try {
    const { name, email, password } = dto;
    const userExistsQuery = `
    SELECT COUNT(*)
    FROM user
    WHERE email = :email    
    `;
    const existingUserCount = await mysqlDB.query(userExistsQuery, {
      type: QueryTypes.SELECT,
      replacements: { email },
    });
    if (existingUserCount.length > 0) {
      invalidInputError("해당 이메일은 이미 사용 중입니다.");
    }
    const createUserQuery = `
      INSERT INTO user (name, email, password)
      VALUES (:name, :email, :password)
    `;
    await mysqlDB.query(createUserQuery, {
      replacements: { name, email, password },
    });

    const newUserQuery = `
      SELECT *
      FROM user
      WHERE email = :email
    `;
    const newUser: User[] = await mysqlDB.query(newUserQuery, {
      type: QueryTypes.SELECT,
      replacements: { email },
    });
    if (!newUser || newUser.length === 0) {
      throw new Error("사용자 생성에 실패했습니다. 다시 시도해주세요.");
    }
    return newUser[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserByUserId = async (userId: number): Promise<User> => {
  try {
    const query = `
    SELECT *
    FROM user
    WHERE id = :userId    
    `;
    const data: User[] = await mysqlDB.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId },
    });
    if (!data || data.length === 0) {
      noResultError("조회된 결과가 없습니다.");
    }
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
