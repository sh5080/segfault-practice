import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: JwtPayload & { userId: number };
}
export {};
