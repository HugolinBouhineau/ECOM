import dayjs from 'dayjs/esm';

import { CommandState } from 'app/entities/enumerations/command-state.model';

import { ICommand, NewCommand } from './command.model';

export const sampleWithRequiredData: ICommand = {
  id: 51722,
};

export const sampleWithPartialData: ICommand = {
  id: 66404,
  state: CommandState['InProgress'],
};

export const sampleWithFullData: ICommand = {
  id: 82127,
  address: 'Shirt',
  state: CommandState['Completed'],
  purchaseDate: dayjs('2023-10-11'),
};

export const sampleWithNewData: NewCommand = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
