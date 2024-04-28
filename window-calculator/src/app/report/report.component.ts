import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../data-collection/user-data/user-data.service';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum, WindowDataModel } from '../data-collection/user-data/window-data-model';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum, WindowPropertiesModel } from '../data-collection/user-data/window-properties-model';
import { DataService } from './services/data.service';
import { NewFrameType, RetrofitWindowType } from './retrofit-window';
import { CommonModule, NgIf } from '@angular/common';
import { FinancialCalculator } from './financial-calculator';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Data, RouterLink, RouterOutlet } from '@angular/router';
import { FinanceReportComponent } from './finance-report/finance-report.component';
import { EnvironmentReportComponent } from './environment-report/environment-report.component';
import { ComfortReportComponent } from './comfort-report/comfort-report.component';
import { SoundReportComponent } from './sound-report/sound-report.component';
import { ReportHeaderComponent } from './report-header/report-header.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { CalculationService } from './services/calculation.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ShareButtonsModule, ReportHeaderComponent, NgIf, CommonModule, HeaderComponent, FooterComponent, RouterLink, RouterOutlet],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
// Get in data from data collection components via service
// Do calculations here and pass to report sub-components
// user can input a quote from window business and it should factor into financial calculation
  public homeData: WindowDataModel;
  loaded = false;


  constructor(private userDataService: UserDataService, private dataService: DataService, public calculationService: CalculationService) {}

  ngOnInit() {
    // run calculations and then load child components
    this.homeData = this.userDataService.getUserWindowData();

    // TODO: remove after testing
    // this.homeData = {
    //   homeName: "My Home",
    //   homeHeight: 1,
    //   heatingSystem: HeatingSystemEnum.HEAT_PUMP,
    //   coolingSystem: CoolingSystemEnum.HEAT_PUMP,
    //   heatingSetPoint: 70, // 55-85 range
    //   coolingSetPoint: 77, // 60-90 range
    //   windShielding: WindShieldingEnum.TYPICAL,
    //   windowProperties: [
    //     {
    //       name: "Window 1",
    //       width: 36,
    //       height: 24,
    //       area: 247, // set to 247 ft2 if simplified
    //       perimeter: 256, // set to 256 ft if simplified
    //       glass: GlassTypeEnum.CLEAR,
    //       frame: FrameTypeEnum.METAL,
    //       operability: OperabilityTypeEnum.AWNING_MULTI,
    //       orientation: OrientationTypeEnum.EVEN,
    //       simplified: true
    //     }
    //   ]
    // }
    // this.userDataService.setUserWindowData(this.homeData)

    this.dataService.observableLock.subscribe((x) => {
      if (x == "Data Tables Loaded") {
        for (let windowType of Object.values(RetrofitWindowType).filter((v) => !isNaN(Number(v))).map(v => Number(v))) {
          windowType = RetrofitWindowType[RetrofitWindowType[windowType]]
          this.calculationService.calculateUpfrontCost(this.homeData.windowProperties, windowType);

          // Tested
          this.calculationService.calculateAnnualHeatingDemandEnergySavings(this.homeData, windowType);
          this.calculationService.calculateAnnualHeatingFinancialSavings(this.homeData, windowType);
          this.calculationService.calculateAnnualCoolingDemandEnergySavings(this.homeData, windowType);
          this.calculationService.calculateAnnualCoolingFinancialSavings(this.homeData, windowType);
          this.calculationService.calculateTotalAnnualFinancialSavings(this.homeData, windowType);
          //

          this.calculationService.calculateProductLifespan(NewFrameType.METAL, windowType);

          this.calculationService.calculateLifetimeSavings(windowType);

          this.calculationService.calculatePaybackDate(windowType);

          // recalculate the following for Energy Star windows upon frame material input change
          this.calculationService.calculateUpfrontCarbonImpact(this.homeData, windowType);
          this.calculationService.calculateLifetimeEnergySavings(this.homeData, windowType);
          this.calculationService.calculateLifetimeEnergyImpact(windowType);
          this.calculationService.calculateLifetimeTreeImpact(windowType);

          this.calculationService.calculateOperativeTemperature(this.homeData, windowType);
        }

        this.calculationService.calculateExistingOperativeTemperature(this.homeData);

        console.log("report loaded")
        this.loaded = true;
      }
    });

    this.dataService.loadDataTables();
  }

  onOutletLoaded(component: FinanceReportComponent | EnvironmentReportComponent | ComfortReportComponent | SoundReportComponent) {
    if (component instanceof FinanceReportComponent) {
      component.initialCosts_low = this.calculationService.upfrontCost_low;
      component.initialCosts_high = this.calculationService.upfrontCost_high;
      component.lifespan = this.calculationService.productLifespan;
      component.yearlySavings = this.calculationService.totalSavings;
      component.lifetimeSavings = this.calculationService.lifetimeSavings;
      component.paybackDates = this.calculationService.paybackDates;
    } else if (component instanceof EnvironmentReportComponent) {
      component.embodiedCarbon = this.calculationService.upfrontCarbonImpact;
      component.lifetimeCarbonSavings = this.calculationService.lifetimeEnergySavings;
      component.lifetimeCarbonImpact = this.calculationService.lifetimeEnergyImpact;
      for (let key of Object.keys(this.calculationService.lifetimeTreeImpact)) {
          this.calculationService.lifetimeTreeImpact[key] = Math.round(this.calculationService.lifetimeTreeImpact[key]);
          this.calculationService.treePic[key] = Math.round(this.calculationService.lifetimeTreeImpact[key] / 100);
          this.calculationService.treePic[key] = this.calculationService.treePic[key] > 10 ? 10 : this.calculationService.treePic[key]; // 10 is upper bound for pics
          this.calculationService.treePic[key] = this.calculationService.treePic[key] < 1 ? 1 : this.calculationService.treePic[key]; // 1 is lower bound for pics
        }
      component.numTrees = this.calculationService.lifetimeTreeImpact;
      component.treePic = this.calculationService.treePic;
    } else if (component instanceof ComfortReportComponent) {
      component.coolingSetPoint = this.homeData.coolingSetPoint;
      component.existingTempIncrease = this.calculationService.existingOperativeTemp;
      component.upgradeTempIncreases = this.calculationService.operativeTemp;
    } else if (component instanceof SoundReportComponent) {
      // no op
    }
  }
}
