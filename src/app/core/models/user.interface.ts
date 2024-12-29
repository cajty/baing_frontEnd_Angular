export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'EMPLOYEE';
    firstName?: string;
    lastName?: string;
  }
}
