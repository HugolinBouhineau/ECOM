import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommandItem, NewCommandItem } from '../command-item.model';

export type PartialUpdateCommandItem = Partial<ICommandItem> & Pick<ICommandItem, 'id'>;

export type EntityResponseType = HttpResponse<ICommandItem>;
export type EntityArrayResponseType = HttpResponse<ICommandItem[]>;

@Injectable({ providedIn: 'root' })
export class CommandItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/command-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  all(): Observable<ICommandItem[]> {
    return this.http.get<ICommandItem[]>(this.resourceUrl + '?eagerload=true').pipe(map((body: ICommandItem[]) => body));
  }

  create(commandItem: NewCommandItem): Observable<EntityResponseType> {
    return this.http.post<ICommandItem>(this.resourceUrl, commandItem, { observe: 'response' });
  }

  update(commandItem: ICommandItem): Observable<EntityResponseType> {
    return this.http.put<ICommandItem>(`${this.resourceUrl}/${this.getCommandItemIdentifier(commandItem)}`, commandItem, {
      observe: 'response',
    });
  }

  partialUpdate(commandItem: PartialUpdateCommandItem): Observable<EntityResponseType> {
    return this.http.patch<ICommandItem>(`${this.resourceUrl}/${this.getCommandItemIdentifier(commandItem)}`, commandItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommandItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommandItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommandItemIdentifier(commandItem: Pick<ICommandItem, 'id'>): number {
    return commandItem.id;
  }

  compareCommandItem(o1: Pick<ICommandItem, 'id'> | null, o2: Pick<ICommandItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommandItemIdentifier(o1) === this.getCommandItemIdentifier(o2) : o1 === o2;
  }

  addCommandItemToCollectionIfMissing<Type extends Pick<ICommandItem, 'id'>>(
    commandItemCollection: Type[],
    ...commandItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commandItems: Type[] = commandItemsToCheck.filter(isPresent);
    if (commandItems.length > 0) {
      const commandItemCollectionIdentifiers = commandItemCollection.map(
        commandItemItem => this.getCommandItemIdentifier(commandItemItem)!
      );
      const commandItemsToAdd = commandItems.filter(commandItemItem => {
        const commandItemIdentifier = this.getCommandItemIdentifier(commandItemItem);
        if (commandItemCollectionIdentifiers.includes(commandItemIdentifier)) {
          return false;
        }
        commandItemCollectionIdentifiers.push(commandItemIdentifier);
        return true;
      });
      return [...commandItemsToAdd, ...commandItemCollection];
    }
    return commandItemCollection;
  }
}
