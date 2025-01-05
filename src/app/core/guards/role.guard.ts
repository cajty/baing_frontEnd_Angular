import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from "../services/auth.service";


export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'];
  console.log('requiredRole', requiredRole);
  const hasRole = authService.hasRole(requiredRole);
 console.log('hasRole', hasRole);
  return hasRole || router.createUrlTree(['/unauthorized']);
};
