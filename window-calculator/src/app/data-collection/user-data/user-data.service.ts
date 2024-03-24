import { Injectable } from '@angular/core';
import { WindowDataModel } from './window-data-model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  windowData: WindowDataModel;

  constructor() {}

  setUserWindowData(userInput:WindowDataModel): void {
    this.windowData = userInput;
  }

  getUserWindowData(): WindowDataModel {
    return this.windowData;
  }
}
