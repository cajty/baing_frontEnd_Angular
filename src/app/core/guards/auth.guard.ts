import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from "../services/token.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const isLoggedIn = tokenService.getAccessToken() !== null;
 return isLoggedIn ? true
                    : router.navigate(['/auth/login']);
};
