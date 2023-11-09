import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommand, NewCommand } from '../command.model';
import {IPlant} from "../../plant/plant.model";

export type PartialUpdateCommand = Partial<ICommand> & Pick<ICommand, 'id'>;

type RestOf<T extends ICommand | NewCommand> = Omit<T, 'purchaseDate'> & {
  purchaseDate?: string | null;
};

export type RestCommand = RestOf<ICommand>;

export type NewRestCommand = RestOf<NewCommand>;

export type PartialUpdateRestCommand = RestOf<PartialUpdateCommand>;

export type EntityResponseType = HttpResponse<ICommand>;
export type EntityArrayResponseType = HttpResponse<ICommand[]>;

@Injectable({ providedIn: 'root' })
export class CommandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commands');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  all(): Observable<ICommand[]> {
    return this.http.get(this.resourceUrl + '?eagerload=true').pipe(map((body: any) => body));
  }

  create(command: NewCommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(command);
    return this.http
      .post<RestCommand>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(command: ICommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(command);
    return this.http
      .put<RestCommand>(`${this.resourceUrl}/${this.getCommandIdentifier(command)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateNoDate(command: ICommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(command);
    return this.http
      .put<RestCommand>(`${this.resourceUrl}/${this.getCommandIdentifier(command)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(command: PartialUpdateCommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(command);
    return this.http
      .patch<RestCommand>(`${this.resourceUrl}/${this.getCommandIdentifier(command)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCommand>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCommand[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommandIdentifier(command: Pick<ICommand, 'id'>): number {
    return command.id;
  }

  compareCommand(o1: Pick<ICommand, 'id'> | null, o2: Pick<ICommand, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommandIdentifier(o1) === this.getCommandIdentifier(o2) : o1 === o2;
  }

  addCommandToCollectionIfMissing<Type extends Pick<ICommand, 'id'>>(
    commandCollection: Type[],
    ...commandsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commands: Type[] = commandsToCheck.filter(isPresent);
    if (commands.length > 0) {
      const commandCollectionIdentifiers = commandCollection.map(commandItem => this.getCommandIdentifier(commandItem)!);
      const commandsToAdd = commands.filter(commandItem => {
        const commandIdentifier = this.getCommandIdentifier(commandItem);
        if (commandCollectionIdentifiers.includes(commandIdentifier)) {
          return false;
        }
        commandCollectionIdentifiers.push(commandIdentifier);
        return true;
      });
      return [...commandsToAdd, ...commandCollection];
    }
    return commandCollection;
  }

  protected convertDateFromClient<T extends ICommand | NewCommand | PartialUpdateCommand>(command: T): RestOf<T> {
    return {
      ...command,
      purchaseDate: command.purchaseDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCommand: RestCommand): ICommand {
    return {
      ...restCommand,
      purchaseDate: restCommand.purchaseDate ? dayjs(restCommand.purchaseDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCommand>): HttpResponse<ICommand> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCommand[]>): HttpResponse<ICommand[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
