interface Response {
  statusCode: number;
  message: string;
  data?: any;
}

export interface LoginResponse extends Response {
  data: { name: string };
}
