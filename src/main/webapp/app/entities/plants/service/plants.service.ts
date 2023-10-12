import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlants, NewPlants } from '../plants.model';

export type PartialUpdatePlants = Partial<IPlants> & Pick<IPlants, 'id'>;

export type EntityResponseType = HttpResponse<IPlants>;
export type EntityArrayResponseType = HttpResponse<IPlants[]>;

@Injectable({ providedIn: 'root' })
export class PlantsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(plants: NewPlants): Observable<EntityResponseType> {
    return this.http.post<IPlants>(this.resourceUrl, plants, { observe: 'response' });
  }

  update(plants: IPlants): Observable<EntityResponseType> {
    return this.http.put<IPlants>(`${this.resourceUrl}/${this.getPlantsIdentifier(plants)}`, plants, { observe: 'response' });
  }

  partialUpdate(plants: PartialUpdatePlants): Observable<EntityResponseType> {
    return this.http.patch<IPlants>(`${this.resourceUrl}/${this.getPlantsIdentifier(plants)}`, plants, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlants>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlants[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlantsIdentifier(plants: Pick<IPlants, 'id'>): number {
    return plants.id;
  }

  comparePlants(o1: Pick<IPlants, 'id'> | null, o2: Pick<IPlants, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlantsIdentifier(o1) === this.getPlantsIdentifier(o2) : o1 === o2;
  }

  addPlantsToCollectionIfMissing<Type extends Pick<IPlants, 'id'>>(
    plantsCollection: Type[],
    ...plantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plants: Type[] = plantsToCheck.filter(isPresent);
    if (plants.length > 0) {
      const plantsCollectionIdentifiers = plantsCollection.map(plantsItem => this.getPlantsIdentifier(plantsItem)!);
      const plantsToAdd = plants.filter(plantsItem => {
        const plantsIdentifier = this.getPlantsIdentifier(plantsItem);
        if (plantsCollectionIdentifiers.includes(plantsIdentifier)) {
          return false;
        }
        plantsCollectionIdentifiers.push(plantsIdentifier);
        return true;
      });
      return [...plantsToAdd, ...plantsCollection];
    }
    return plantsCollection;
  }
}
