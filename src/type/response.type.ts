interface Response {
  statusCode: number;
  message: string;
  data?: any;
}

export interface LoginResponse extends Response {
  data: { nickname: string; role: string };
}
