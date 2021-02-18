import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthorizedGuard implements CanActivate {


  constructor( private authService: AuthService, private router: Router ) {

  }
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

    if ( ! this.authService.isAuthenticated() ) {

      let targetRoute = state.url;

      this.router.navigate( ['login'], { state: { data: {  'next': targetRoute } } } );

      return false;
    }

    return true;
  }

}


@Injectable()
export class NotAuthorizedGuard implements CanActivate {

  constructor( private authService: AuthService, private router: Router ) {

  }
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

    if ( this.authService.isAuthenticated() ) {

        this.router.navigate( ['home'] );

      return false;
    }


    return true;
  }

}

