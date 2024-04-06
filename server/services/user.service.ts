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
