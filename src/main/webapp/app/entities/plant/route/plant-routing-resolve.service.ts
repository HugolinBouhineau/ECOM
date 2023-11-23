import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlant } from '../plant.model';
import { PlantService } from '../service/plant.service';

@Injectable({ providedIn: 'root' })
export class PlantRoutingResolveService implements Resolve<IPlant | null> {
  constructor(protected service: PlantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlant | null | never> {
    const id = route.params['id'];
    if (id && id!='new') {
      return this.service.find(id).pipe(
        mergeMap((plant: HttpResponse<IPlant>) => {
          if (plant.body) {
            return of(plant.body);
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
