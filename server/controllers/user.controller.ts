import { NextFunction, Request, Response } from "express";
import {
  isSuccess,
  successCode,
  successMessage,
} from "../middlewares/error.middleware";
import { getUserByUserId } from "../services/user.service";
import { AuthRequest } from "../types/request.type";

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
