export interface User {
  id: bigint;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  birthDate: Date;
  gender: boolean;
  role: number;
  valid: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
