export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: number;
  created_at: Date;
}

export interface UserToken {
  userId: number;
  refreshToken: string;
  created_at: Date;
}
