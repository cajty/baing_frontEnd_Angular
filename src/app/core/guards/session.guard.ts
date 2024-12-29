import { CanActivateFn } from '@angular/router';

export const SessionGuard: CanActivateFn = (route, state) => {
  return true;
};
