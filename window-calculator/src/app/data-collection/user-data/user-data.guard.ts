import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDataService } from './user-data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataGuard implements CanActivate {

  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.userDataService.checkForWindowData().pipe(map((data => {
      if (data) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    })));
  }
}
