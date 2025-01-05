import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private  ACCESS_TOKEN_KEY = 'access_token';


  setTokens(accessToken: string ): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }



  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}
