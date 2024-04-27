export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: number;
  user_id: number;
  phone: string;
  score: number;
  created_at: Date;
  updated_at: Date;
}
