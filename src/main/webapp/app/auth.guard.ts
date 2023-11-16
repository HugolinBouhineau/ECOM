import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StateStorageService } from './core/auth/state-storage.service';
import { AccountService } from './core/auth/account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router, private stateStorageService: StateStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          return true;
        }
        this.stateStorageService.storeUrl(state.url);
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
