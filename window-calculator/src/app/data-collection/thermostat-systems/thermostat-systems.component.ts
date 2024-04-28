import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDataService } from '../user-data/user-data.service';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum, WindowDataModel } from '../user-data/window-data-model';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum } from '../user-data/window-properties-model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thermostat-systems',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, RouterLink, CommonModule],
  templateUrl: './thermostat-systems.component.html',
  styleUrl: './thermostat-systems.component.scss'
})
export class ThermostatSystemsComponent {
  faQuestion: IconDefinition = faQuestionCircle;
  heatingSetPoint: number;
  coolingSetPoint: number;
  userData: WindowDataModel;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    // Set default values
    this.heatingSetPoint = 70;
    this.coolingSetPoint = 77;

    this.userData = this.userDataService.getUserWindowData();
    this.heatingSetPoint = this.userData.heatingSetPoint ? this.userData.heatingSetPoint : this.heatingSetPoint;
    this.coolingSetPoint = this.userData.coolingSetPoint ? this.userData.coolingSetPoint : this.coolingSetPoint;

    this.userData.heatingSetPoint = this.heatingSetPoint;
    this.userData.coolingSetPoint = this.coolingSetPoint;
    this.userDataService.setUserWindowData(this.userData);
  }

  incHeatingSetPoint(): void {
    if (this.heatingSetPoint < 85) {
      this.heatingSetPoint++;
      this.userData.heatingSetPoint = this.heatingSetPoint;
      this.userDataService.setUserWindowData(this.userData);
    }
  }

  decHeatingSetPoint(): void {
    if (this.heatingSetPoint > 55) {
      this.heatingSetPoint--;
      this.userData.heatingSetPoint = this.heatingSetPoint;
      this.userDataService.setUserWindowData(this.userData);
    }
  }

  incCoolingSetPoint(): void {
    if (this.coolingSetPoint < 90) {
      this.coolingSetPoint++;
      this.userData.coolingSetPoint = this.coolingSetPoint;
      this.userDataService.setUserWindowData(this.userData);
    }
  }

  decCoolingSetPoint(): void {
    if (this.coolingSetPoint > 60) {
      this.coolingSetPoint--;
      this.userData.coolingSetPoint = this.coolingSetPoint;
      this.userDataService.setUserWindowData(this.userData);
    }
  }
}
