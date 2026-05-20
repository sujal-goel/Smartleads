import { Document } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}
