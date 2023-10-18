import dayjs from 'dayjs/esm';

import { CommandState } from 'app/entities/enumerations/command-state.model';

import { ICommand, NewCommand } from './command.model';

export const sampleWithRequiredData: ICommand = {
  id: 51722,
};

export const sampleWithPartialData: ICommand = {
  id: 18116,
  purchaseDate: dayjs('2023-10-18'),
};

export const sampleWithFullData: ICommand = {
  id: 15158,
  state: CommandState['Cancelled'],
  purchaseDate: dayjs('2023-10-18'),
};

export const sampleWithNewData: NewCommand = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
