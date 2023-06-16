export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: Date;
  email: string;
  phone?: string;
  address?: string;
  intro?: string;
  avatar?: string;
  lastLogin?: Date;
  roleId?: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

export interface AuthResponse {
  id: string;
  avatar: string;
  token: {
    accessToken: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

export interface VerifyParams {
  otp: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
}
