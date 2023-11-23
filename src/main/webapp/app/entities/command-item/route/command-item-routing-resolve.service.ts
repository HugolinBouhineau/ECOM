import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommandItem } from '../command-item.model';
import { CommandItemService } from '../service/command-item.service';

@Injectable({ providedIn: 'root' })
export class CommandItemRoutingResolveService implements Resolve<ICommandItem | null> {
  constructor(protected service: CommandItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommandItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commandItem: HttpResponse<ICommandItem>) => {
          if (commandItem.body) {
            return of(commandItem.body);
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
