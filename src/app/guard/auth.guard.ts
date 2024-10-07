import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth); // Inyectar el servicio de autenticación de Firebase

  return authState(auth).pipe(
    map(user => {
      if (user) {
        // Usuario autenticado
        if (route.routeConfig?.path === 'login') {
          router.navigateByUrl('dashboard'); // Redirigir a dashboard si está autenticado
          return false; // Impedir el acceso al login
        }
        return true; // Permitir el acceso al dashboard u otras rutas
      } else {
        // Usuario no autenticado
        if (route.routeConfig?.path === 'dashboard') {
          router.navigateByUrl('login'); // Redirigir a login si no está autenticado
          return false; // Impedir el acceso al dashboard
        }
        return true; // Permitir el acceso a otras rutas
      }
    })
  );
};
