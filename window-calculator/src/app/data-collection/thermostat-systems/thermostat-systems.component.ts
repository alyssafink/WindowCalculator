import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDataService } from '../user-data/user-data.service';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum, WindowDataModel } from '../user-data/window-data-model';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum } from '../user-data/window-properties-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thermostat-systems',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, RouterLink],
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

    let homeData = {
      homeName: "Test",
      heatingSystem: HeatingSystemEnum.ELECTRIC,
      homeHeight: 3,
      coolingSetPoint: 60,
      heatingSetPoint: 55,
      coolingSystem: CoolingSystemEnum.CENTRAL_AC,
      windShielding: WindShieldingEnum.EXPOSED,
      windowProperties: [{
        name: "",
        width: 0,
        height: 0,
        area: 256,
        perimeter: 247,
        glass: GlassTypeEnum.CLEAR,
        frame: FrameTypeEnum.ALUMINUM,
        operability: OperabilityTypeEnum.AWNING_MULTI,
        orientation: OrientationTypeEnum.EAST,
        simplified: false
      }]
    }

    this.userData = this.userDataService.getUserWindowData();

    this.userData = homeData;

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
