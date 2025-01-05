// user.interface.ts
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterResponse {
  message: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  creditScore: number;
  monthlyIncome: number;
  role: string;
  accountIds: number[];
  invoiceIds: number[];
  loanIds: number[];
}

export interface LoginResponse {
  expiresIn: number;
  token: string;
  role: string;
  user: User;
}
