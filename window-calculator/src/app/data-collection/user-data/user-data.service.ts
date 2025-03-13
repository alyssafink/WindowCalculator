import { Injectable } from '@angular/core';
import { WindowDataModel } from './window-data-model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  windowData: WindowDataModel;

  constructor() {}

  setUserWindowData(userInput:WindowDataModel): void {
    this.windowData = userInput;
    console.log(this.windowData)
    sessionStorage.setItem('userDetails', JSON.stringify(this.windowData));
  }

  getUserWindowData(): WindowDataModel {
    console.log(this.windowData)
    this.windowData = JSON.parse(sessionStorage.getItem('userDetails'));
    return this.windowData;
  }

  checkForWindowData(): Observable<boolean> {
    if (this.getUserWindowData()) {
      return of(true);
    }

    return of(false);
  }
}
