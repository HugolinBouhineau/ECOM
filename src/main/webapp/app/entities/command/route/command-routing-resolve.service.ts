import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommand } from '../command.model';
import { CommandService } from '../service/command.service';

@Injectable({ providedIn: 'root' })
export class CommandRoutingResolveService implements Resolve<ICommand | null> {
  constructor(protected service: CommandService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommand | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((command: HttpResponse<ICommand>) => {
          if (command.body) {
            return of(command.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
