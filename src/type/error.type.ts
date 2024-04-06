import { AxiosError, AxiosResponse } from "axios";

export class RequestTimeoutException extends Error {
  constructor(message?: string) {
    super(message || "요청이 타임아웃되었습니다.");
    this.name = "RequestTimeoutException";
  }
}
export class DefaultAxiosError extends AxiosError {
  response: AxiosResponse<any>;
}
export class ServerError extends Error {
  constructor(message?: string) {
    super(
      message ||
        `서버 오류입니다. 다시 시도해주세요. \n지속될 경우 관리자에게 문의해주세요.`
    );
    this.name = "ServerError";
  }
}
export class ClientError extends Error {
  constructor(message?: string) {
    super(message || "클라이언트 오류입니다.");
    this.name = "ClientError";
  }
}
