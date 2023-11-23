import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlant, NewPlant } from '../plant.model';

export type PartialUpdatePlant = Partial<IPlant> & Pick<IPlant, 'id'>;

export type EntityResponseType = HttpResponse<IPlant>;
export type EntityArrayResponseType = HttpResponse<IPlant[]>;

@Injectable({ providedIn: 'root' })
export class PlantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  all(): Observable<IPlant[]> {
    return this.http.get(this.resourceUrl + '?eagerload=true').pipe(map((body: any) => body));
  }

  create(plant: NewPlant): Observable<EntityResponseType> {
    return this.http.post<IPlant>(this.resourceUrl, plant, { observe: 'response' });
  }

  update(plant: IPlant): Observable<EntityResponseType> {
    return this.http.put<IPlant>(`${this.resourceUrl}/${this.getPlantIdentifier(plant)}`, plant, { observe: 'response' });
  }

  partialUpdate(plant: PartialUpdatePlant): Observable<EntityResponseType> {
    return this.http.patch<IPlant>(`${this.resourceUrl}/${this.getPlantIdentifier(plant)}`, plant, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  filterPlant(searchPlant: string, categories: Number[]): Observable<IPlant[]> {
    return this.http
      .get(this.resourceUrl + '/filter/categories?name=' + searchPlant + '&categoriesId=' + categories.toString())
      .pipe(map((body:any) => body));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlantIdentifier(plant: Pick<IPlant, 'id'>): number {
    return plant.id;
  }

  comparePlant(o1: Pick<IPlant, 'id'> | null, o2: Pick<IPlant, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlantIdentifier(o1) === this.getPlantIdentifier(o2) : o1 === o2;
  }

  addPlantToCollectionIfMissing<Type extends Pick<IPlant, 'id'>>(
    plantCollection: Type[],
    ...plantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plants: Type[] = plantsToCheck.filter(isPresent);
    if (plants.length > 0) {
      const plantCollectionIdentifiers = plantCollection.map(plantItem => this.getPlantIdentifier(plantItem)!);
      const plantsToAdd = plants.filter(plantItem => {
        const plantIdentifier = this.getPlantIdentifier(plantItem);
        if (plantCollectionIdentifiers.includes(plantIdentifier)) {
          return false;
        }
        plantCollectionIdentifiers.push(plantIdentifier);
        return true;
      });
      return [...plantsToAdd, ...plantCollection];
    }
    return plantCollection;
  }
}
