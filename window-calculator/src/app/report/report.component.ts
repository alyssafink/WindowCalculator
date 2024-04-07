import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../data-collection/user-data/user-data.service';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum, WindowDataModel } from '../data-collection/user-data/window-data-model';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum, WindowPropertiesModel } from '../data-collection/user-data/window-properties-model';
import { CalculationService } from './services/calculation.service';
import { NewFrameType, RetrofitWindowType } from './retrofit-window';
import { CommonModule, NgIf } from '@angular/common';
import { FinancialCalculator } from './financial-calculator';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FinanceReportComponent } from './finance-report/finance-report.component';
import { EnvironmentReportComponent } from './environment-report/environment-report.component';
import { ComfortReportComponent } from './comfort-report/comfort-report.component';
import { SoundReportComponent } from './sound-report/sound-report.component';
import { ReportHeaderComponent } from './report-header/report-header.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

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
  userInputFrameMaterial: NewFrameType = NewFrameType.FIBERGLASS;
  userInputUpfrontCost_energyStar: number = 0;
  userInputUpfrontCost_storm: number = 0;
  userInputUpfrontCost_film: number = 0;

  upfrontCost_low = {}; // Typical low end upfront cost for replacement windows
  upfrontCost_high = {}; // Typical high end upfront cost for replacement windows
  deltaQh = {}; // Annual heating demand savings
  heatSavings = {}; // Sh, annual heating financial savings
  deltaQc = {}; // Annual cooling demand savings
  coolSavings = {}; // Sc, annual cooling financial savings
  totalSavings = {}; // Sy, annual total financial savings
  productLifespan = {}; // Typical product lifespan for replacement windows
  lifetimeSavings = {}; // Lifetime financial savings for replacement windows
  paybackDates = {}; // Payback dates for replacement windows
  upfrontCarbonImpact = {};
  lifetimeEnergyImpact = {};
  lifetimeEnergySavings = {};
  lifetimeTreeImpact = {};
  treePic = {};

  operativeTemp = {}; // Summer indoor operating temp
  existingOperativeTemp = 0;

  constructor(private userDataService: UserDataService, private calculationService: CalculationService, private financialCalculator: FinancialCalculator) {}

  ngOnInit() {
    // run calculations and then load child components
    this.homeData = this.userDataService.getUserWindowData();
    console.log(this.homeData)

    // TODO: remove after testing
    this.homeData = {
      homeName: "My Home",
      homeHeight: 1,
      heatingSystem: HeatingSystemEnum.HEAT_PUMP,
      coolingSystem: CoolingSystemEnum.HEAT_PUMP,
      heatingSetPoint: 70, // 55-85 range
      coolingSetPoint: 77, // 60-90 range
      windShielding: WindShieldingEnum.TYPICAL,
      windowProperties: [
        {
          name: "Window 1",
          width: 36,
          height: 24,
          area: 247, // set to 247 ft2 if simplified
          perimeter: 256, // set to 256 ft if simplified
          glass: GlassTypeEnum.CLEAR,
          frame: FrameTypeEnum.ALUMINUM,
          operability: OperabilityTypeEnum.AWNING_MULTI,
          orientation: OrientationTypeEnum.EVEN,
          simplified: true
        }
      ]
    }

    this.calculationService.observableLock.subscribe((x) => {
      if (x == "Data Tables Loaded") {
        for (let windowType of Object.values(RetrofitWindowType).filter((v) => !isNaN(Number(v))).map(v => Number(v))) {
          windowType = RetrofitWindowType[RetrofitWindowType[windowType]]
          this.calculateUpfrontCost(this.homeData.windowProperties, windowType);

          // Tested
          this.calculateAnnualHeatingDemandEnergySavings(this.homeData, windowType);
          this.calculateAnnualHeatingFinancialSavings(this.homeData, windowType);
          this.calculateAnnualCoolingDemandEnergySavings(this.homeData, windowType);
          this.calculateAnnualCoolingFinancialSavings(this.homeData, windowType);
          this.calculateTotalAnnualFinancialSavings(this.homeData, windowType);
          //

          this.calculateProductLifespan(this.userInputFrameMaterial, windowType);

          this.calculateLifetimeSavings(windowType);

          this.calculatePaybackDate(windowType);

          // recalculate the following for Energy Star windows upon frame material input change
          this.calculateUpfrontCarbonImpact(this.homeData, windowType);
          this.calculateLifetimeEnergySavings(this.homeData, windowType);
          this.calculateLifetimeEnergyImpact(windowType);
          this.calculateLifetimeTreeImpact(windowType);

          this.calculateOperativeTemperature(this.homeData, windowType);
        }

        this.calculateExistingOperativeTemperature(this.homeData);

        console.log("report loaded")
        this.loaded = true;
      }
    });

    this.calculationService.loadDataTables();
  }

  onOutletLoaded(component: FinanceReportComponent | EnvironmentReportComponent | ComfortReportComponent | SoundReportComponent) {
    if (component instanceof FinanceReportComponent) {
      component.initialCosts_low = this.upfrontCost_low;
      component.initialCosts_high = this.upfrontCost_high;
      component.lifespan = this.productLifespan;
      component.yearlySavings = this.totalSavings;
      component.lifetimeSavings = this.lifetimeSavings;
      component.paybackDates = this.paybackDates;
    } else if (component instanceof EnvironmentReportComponent) {
      component.embodiedCarbon = this.upfrontCarbonImpact;
      component.annualCarbonSavings = this.lifetimeEnergySavings;
      component.lifetimeCarbonImpact = this.lifetimeEnergyImpact;
      for (let key of Object.keys(this.lifetimeTreeImpact)) {
          this.lifetimeTreeImpact[key] = Math.round(this.lifetimeTreeImpact[key]);
          console.log(this.lifetimeTreeImpact[key])
          this.treePic[key] = Math.round(this.lifetimeTreeImpact[key] / 100);
          this.treePic[key] = this.treePic[key] > 10 ? 10 : this.treePic[key]; // 10 is upper bound for pics
      }
      console.log(this.lifetimeTreeImpact, this.treePic)
      component.numTrees = this.lifetimeTreeImpact;
      component.treePic = this.treePic;
    } else if (component instanceof ComfortReportComponent) {
      component.coolingSetPoint = this.homeData.coolingSetPoint;
      component.existingTempIncrease = this.existingOperativeTemp;
      component.upgradeTempIncreases = this.operativeTemp;
    } else if (component instanceof SoundReportComponent) {

    }
  }

  calculateUpfrontCost(windowData: WindowPropertiesModel[], windowType: RetrofitWindowType) {
    if (windowType == RetrofitWindowType.ENERGY_STAR) {
      // Low: number of windows * price per (low)
      // High: number of windows * price per (high)
      let pricePerLow = this.calculationService.getEnergyStarUpfrontCost(this.userInputFrameMaterial, true);
      let pricePerHigh = this.calculationService.getEnergyStarUpfrontCost(this.userInputFrameMaterial, false);
      let numWindows = windowData[0].simplified ? 16 : windowData.length; // If using simplified data, default to 16 windows

      this.upfrontCost_low[windowType] = pricePerLow * numWindows;
      this.upfrontCost_high[windowType] = pricePerHigh * numWindows;
    } else if (windowType == RetrofitWindowType.STORM) {
      // TODO: idk
    } else {
      // Low: total area * price per (low)
      // High: total area * price per (high)
      let pricePerLow = this.calculationService.getStormUpfrontCost(true);
      let pricePerHigh = this.calculationService.getStormUpfrontCost(false);
      let totalArea = 0;
      for (let window of windowData) {
        totalArea += window.area;
      }

      this.upfrontCost_low[windowType] = pricePerLow * totalArea;
      this.upfrontCost_high[windowType] = pricePerHigh * totalArea;
    }
  }

  calculateOperativeTemperature(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    this.operativeTemp[retrofitWindowType] = this.calculationService.getUpgradeOperativeTempIncrease(homeData.windowProperties[0].frame, retrofitWindowType);
  }

  calculateExistingOperativeTemperature(homeData: WindowDataModel) {
    this.existingOperativeTemp = this.calculationService.getExistingOperativeTempIncrease(homeData.windowProperties[0].frame, homeData.windowProperties[0].glass);
  }

  calculateUpfrontCarbonImpact(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let frameGWP = this.calculateFrameGWP(homeData.windowProperties, retrofitWindowType);
    let glazeGWP = this.calculateGlazeGWP(homeData.windowProperties, retrofitWindowType);
    this.upfrontCarbonImpact[retrofitWindowType] = frameGWP + glazeGWP;
  }

  calculateFrameGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mf = this.calculationService.getRetrofitFrameGWP(this.userInputFrameMaterial, retrofitWindowType);
    let Pt = 0;
    for (let window of windowData) {
      Pt += window.perimeter;
    }

    return Mf * Pt;
  }

  calculateGlazeGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mg = this.calculationService.getRetrofitGlazeGWP(retrofitWindowType);
    let At = 0;
    for (let window of windowData) {
      At += window.area;
    }

    return Mg * At;
  }

  calculateLifetimeEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let heatingSavings = this.calculateLifetimeOperationalHeatingSavings(homeData.heatingSystem, retrofitWindowType);
    let coolingSavings = this.calculateLifetimeOperationalCoolingSavings(homeData.coolingSystem, retrofitWindowType);
    this.lifetimeEnergySavings[retrofitWindowType] = heatingSavings + coolingSavings;
  }

  calculateLifetimeOperationalHeatingSavings(heatingSystem: HeatingSystemEnum, windowType: RetrofitWindowType): number {
    let deltaQh = this.deltaQh[windowType];
    let Eh = this.calculationService.getHeatingSystemEfficiency(heatingSystem);
    let Fh = this.calculationService.getHeatingFuelConversionFactor(heatingSystem);
    let Xh = this.calculationService.getHeatingOperationalCarbonConversionFactor(heatingSystem);
    let L = this.productLifespan[windowType];

    return (deltaQh / Eh) * Fh * Xh * L;
  }

  calculateLifetimeOperationalCoolingSavings(coolingSystem: CoolingSystemEnum, windowType: RetrofitWindowType): number {
    let deltaQc = this.deltaQc[windowType];
    let Ec = this.calculationService.getCoolingSystemEfficiency(coolingSystem);
    let Fc = this.calculationService.getCoolingFuelConversionFactor(coolingSystem);
    let Xc = this.calculationService.getCoolingOperationalCarbonConversionFactor(coolingSystem);
    let L = this.productLifespan[windowType];

    return (deltaQc / Ec) * Fc * Xc * L;
  }

  calculateLifetimeEnergyImpact(retrofitWindowType: RetrofitWindowType) {
    this.lifetimeEnergyImpact[retrofitWindowType] = this.lifetimeEnergySavings[retrofitWindowType] - this.upfrontCarbonImpact[retrofitWindowType];
  }

  calculateLifetimeTreeImpact(retrofitWindowType: RetrofitWindowType) {
    const EPA_TREE_FACTOR = 60;
    this.lifetimeTreeImpact[retrofitWindowType] = this.lifetimeEnergyImpact[retrofitWindowType] / EPA_TREE_FACTOR;
  }

  calculatePaybackDate(retrofitWindowType: RetrofitWindowType) {
    let currentYear = new Date().getFullYear();
    let upfrontCost =
      retrofitWindowType == RetrofitWindowType.ENERGY_STAR ? this.userInputUpfrontCost_energyStar :
      retrofitWindowType == RetrofitWindowType.STORM ? this.userInputUpfrontCost_storm :
      this.userInputUpfrontCost_film;

    this.paybackDates[retrofitWindowType] = currentYear + (upfrontCost / this.totalSavings[retrofitWindowType]);
  }

  calculateProductLifespan(frame: NewFrameType, retrofitWindowType: RetrofitWindowType) {
    this.productLifespan[retrofitWindowType] = this.calculationService.getProductLifespan(frame, retrofitWindowType)
  }

  calculateLifetimeSavings(retrofitWindowType: RetrofitWindowType) {
    this.lifetimeSavings[retrofitWindowType] = this.totalSavings[retrofitWindowType] * this.productLifespan[retrofitWindowType];
  }

  calculateAnnualHeatingDemandEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let deltaQth = this.financialCalculator.calculateHeatTransmission_HeatingSeason(homeData, retrofitWindowType);
    let deltaQvh = this.financialCalculator.calculateInfiltrationHeatLoss_HeatingSeason(homeData, retrofitWindowType);
    let deltaQsh = this.financialCalculator.calculateSolarHeatGain_HeatingSeason(homeData, retrofitWindowType);

    this.deltaQh[retrofitWindowType] = deltaQth + deltaQvh - deltaQsh;
  }

  calculateAnnualHeatingFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let energyCoeff = this.calculationService.getHeatingSystemEfficiency(homeData.heatingSystem);
    console.log('Eh',energyCoeff)
    let fuelConversionFactor = this.calculationService.getHeatingFuelConversionFactor(homeData.heatingSystem);
    console.log('Fh',fuelConversionFactor)
    let energyPrice = this.calculationService.getHeatingEnergyPricePerUnit(homeData.heatingSystem);
    console.log('P',energyPrice)
    console.log('Qh', this.deltaQh[retrofitWindowType])

    this.heatSavings[retrofitWindowType] = (this.deltaQh[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateAnnualCoolingDemandEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let deltaQtc = this.financialCalculator.calculateHeatTransmission_CoolingSeason(homeData, retrofitWindowType);
    let deltaQvc = this.financialCalculator.calculateInfiltrationHeatLoss_CoolingSeason(homeData, retrofitWindowType);
    let deltaQsc = this.financialCalculator.calculateSolarHeatGain_CoolingSeason(homeData, retrofitWindowType);

    this.deltaQc[retrofitWindowType] = deltaQtc + deltaQvc + deltaQsc;
  }

  calculateAnnualCoolingFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let energyCoeff = this.calculationService.getCoolingSystemEfficiency(homeData.coolingSystem);
    let fuelConversionFactor = this.calculationService.getCoolingFuelConversionFactor(homeData.coolingSystem);
    let energyPrice = this.calculationService.getCoolingEnergyPricePerUnit(homeData.coolingSystem);

    this.coolSavings[retrofitWindowType] = (this.deltaQc[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateTotalAnnualFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    this.totalSavings[retrofitWindowType] = this.heatSavings[retrofitWindowType] + this.coolSavings[retrofitWindowType];
  }
}
