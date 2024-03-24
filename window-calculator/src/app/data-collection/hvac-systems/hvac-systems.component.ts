import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoolingSystemEnum, HeatingSystemEnum, WindowDataModel } from '../user-data/window-data-model';
import { UserDataService } from '../user-data/user-data.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-hvac-systems',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink],
  templateUrl: './hvac-systems.component.html',
  styleUrl: './hvac-systems.component.scss'
})
export class HvacSystemsComponent {
  faQuestion = faQuestionCircle
  coolingSystemEnum = CoolingSystemEnum;
  heatingSystemEnum = HeatingSystemEnum;
  isNotNumber = isNaN;
  userData: WindowDataModel;
  currentlyClickedHeatingCardIndex = -1;
  currentlyClickedCoolingCardIndex = -1;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userData = this.userDataService.getUserWindowData();
  }

  selectHeatingOption(value: HeatingSystemEnum, index: number) {
    this.currentlyClickedHeatingCardIndex = index;
    this.userData.heatingSystem = value;
    this.userDataService.setUserWindowData(this.userData);
  }

  selectCoolingOption(value: CoolingSystemEnum, index: number) {
    this.currentlyClickedCoolingCardIndex = index;
    this.userData.coolingSystem = value;
    this.userDataService.setUserWindowData(this.userData);
  }

  public checkIfHeatingCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedHeatingCardIndex;
  }

  public checkIfCoolingCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCoolingCardIndex;
  }
}
