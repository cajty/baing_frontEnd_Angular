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

}




export interface LoginResponse {
  expiresIn: number;
  token: string;
  role: string;
  user: User;
}


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
  role: string;
}

export interface UserRequest {
  name: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
  role: string;
}




