import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlants } from '../plants.model';
import { PlantsService } from '../service/plants.service';

@Injectable({ providedIn: 'root' })
export class PlantsRoutingResolveService implements Resolve<IPlants | null> {
  constructor(protected service: PlantsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlants | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plants: HttpResponse<IPlants>) => {
          if (plants.body) {
            return of(plants.body);
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
