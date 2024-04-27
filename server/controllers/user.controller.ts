import { NextFunction, Request, Response } from "express";
import {
  isSuccess,
  successCode,
  successMessage,
} from "../middlewares/error.middleware";
import { getUserByUserId, createUser } from "../services/user.service";
import { AuthRequest } from "../types/request.type";
import { SignupDto } from "../dtos/user.dto";

export const signup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto: SignupDto = req.body;

    const userData = await createUser(dto);
    const resultData = { userId: userData.id };
    res
      .status(successCode.CREATED)
      .json(
        isSuccess(
          successCode.CREATED,
          successMessage.CREATE_POST_SUCCESS,
          resultData
        )
      );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const userData = await getUserByUserId(userId);
    res
      .status(200)
      .json(
        isSuccess(successCode.OK, successMessage.READ_POST_SUCCESS, userData)
      );
  } catch (error) {
    console.error(error);
    next(error);
  }
};
