import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlant, NewPlant, PlantQuantity } from '../plant.model';

export type PartialUpdatePlant = Partial<IPlant> & Pick<IPlant, 'id'>;

export type EntityResponseType = HttpResponse<IPlant>;
export type EntityArrayResponseType = HttpResponse<IPlant[]>;

@Injectable({ providedIn: 'root' })
export class PlantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  verifyAndUpdateStock(plants: PlantQuantity[]): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(this.resourceUrl + '/verifyAndUpdateStock', plants, { observe: 'response' });
  }

  refillPlant(commandId: number): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(this.resourceUrl + '/refillPlant', commandId, { observe: 'response' });
  }

  uploadImage(img: FormData): Observable<HttpResponse<{}>> {
    return this.http.post(this.resourceUrl + '/uploadImage', img, { observe: 'response' });
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

  filterPlant(page: number, size: number, sort: string, searchPlant: string, categories: number[]): Observable<any> {
    return this.http.get(
      `${this.resourceUrl}/filter/paginate?page=${page}&size=${size}&sort=${sort}&name=${searchPlant}&categoriesId=${categories.toString()}`
    );
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
