export class CommonError extends Error {
  detail: string;
  status: number;
  constructor(status: number, message: string, detail: string) {
    super(message);
    this.status = status;
    this.detail = detail;
    Object.setPrototypeOf(this, CommonError.prototype);
  }
}

export class UnauthorizedException extends Error {
  detail: string;
  status: number;
  constructor(message: string) {
    super(message);
    this.status = 401;
    this.detail = "unauthorized error";
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
