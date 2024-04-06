import { Request, Response, NextFunction } from "express";
import { CommonError, UnauthorizedException } from "../types/error.type";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("!!: ", err.status);
  if (err instanceof CommonError) {
    const { message, status, detail } = err;
    const errorResponse = {
      status,
      success: false,
      message,
      detail: detail,
    };
    return res.status(status).json(errorResponse);
  }
  if (err.status === 401 || err.status === 403) {
    const { message, status, detail } = err;
    const errorResponse = {
      status,
      success: false,
      message,
      detail: detail,
    };
    return res.status(status).json(errorResponse);
  } else if (err.response && err.response.data.status < 500) {
    const { message, status, detail } = err.response.data;
    const errorResponse = {
      status,
      success: false,
      message,
      detail: detail,
    };
    if (err.response.data.status === 422) {
      errorResponse.message =
        "예상치 못한 오류입니다. 관리자에게 문의해주세요.";
      delete errorResponse.detail;
    }
    res.status(status).json(errorResponse);
  } else {
    res.status(500).json({
      message: "Unexpected Error",
      name: err.message,
      status: 500,
    });
    console.error("non catched in error Handler: ", err.message);
  }
};

export const isSuccess = (status: number, message: string, data?: any) => {
  return {
    status,
    success: true,
    message,
    data,
  };
};
export const successMessage = {
  LOGIN_SUCCESS: "Login Success",
  CREATE_POST_SUCCESS: "Create Success",
  READ_POST_SUCCESS: "Find Success",
  UPDATE_POST_SUCCESS: "Update Success",
  DELETE_POST_SUCCESS: "Delete Success",
};

export const errorMessage = {
  NULL_VALUE: "Nullable Value",
  INVALID_INPUT: "Invalid Input",
  REGEX_CHECK: "Regex Check",
  DUPLICATE: "Duplicated Value",
  NOT_FOUND: "Not Found",
  CONFLICT: "Already Exists",
  BAD_REQUEST: "Bad Request",
  UNIQUE_CONSTRAINT_ERROR: "Unique Constraint Error",
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED: "Unauthorized Error",
  INTERNAL_SERVER_ERROR: "Server Error",
};
export const successCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

export const errorCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  DUPLICATE: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 600,
};

export const noResultError = (message: string) => {
  throw new CommonError(errorCode.NOT_FOUND, errorMessage.NOT_FOUND, message);
};

export const invalidInputError = (message: string) => {
  throw new CommonError(
    errorCode.BAD_REQUEST,
    errorMessage.INVALID_INPUT,
    message
  );
};
export const requiredInputError = (message: string) => {
  throw new CommonError(
    errorCode.BAD_REQUEST,
    errorMessage.NULL_VALUE,
    message
  );
};
export const validateInputObjectFields = (
  input: { [key: string]: any }[],
  allowedFields: string[]
) => {
  input.forEach((item) => {
    const extraFields = Object.keys(item).filter(
      (field) => !allowedFields.includes(field)
    );

    if (extraFields.length > 0) {
      throw new CommonError(
        errorCode.BAD_REQUEST,
        errorMessage.INVALID_INPUT,
        `입력값이 올바르지 않습니다. 다음 필드는 허용되지 않습니다: ${extraFields.join(
          ", "
        )}`
      );
    }
  });
};
