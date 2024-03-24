import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../data-collection/user-data/user-data.service';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum, WindowDataModel } from '../data-collection/user-data/window-data-model';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum, WindowPropertiesModel } from '../data-collection/user-data/window-properties-model';
import { CalculationService } from './services/calculation.service';
import { RetrofitWindowType } from './retrofit-window';
import { NgIf } from '@angular/common';
import { FinancialCalculator } from './financial-calculator';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NgIf],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
// Get in data from data collection components via service
// Do calculations here and pass to report sub-components
// user can input a quote from window business and it should factor into financial calculation
  loaded = false;

  upfrontCost = {}; // Typical upfront cost for replacement windows
  deltaQh = {}; // Annual heating demand savings
  heatSavings = {}; // Sh, annual heating financial savings
  deltaQc = {}; // Annual cooling demand savings
  coolSavings = {}; // Sc, annual cooling financial savings
  totalSavings = {}; // Sy, annual total financial savings
  productLifespan = {}; // Typical product lifespan for replacement windows
  lifetimeSavings = {}; // Lifetime energy savings for replacement windows
  paybackDates = {};

  constructor(private userDataService: UserDataService, private calculationService: CalculationService, private financialCalculator: FinancialCalculator) {}

  ngOnInit() {
    // run calculations and then load child components
    let homeData: WindowDataModel = this.userDataService.getUserWindowData();
    homeData = {
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

    this.calculationService.observableLock.subscribe((x) => {
      if (x == "Data Tables Loaded") {
        for (let windowType of Object.values(RetrofitWindowType).filter((v) => !isNaN(Number(v))).map(v => Number(v))) {
          windowType = RetrofitWindowType[RetrofitWindowType[windowType]]
          this.calculateAnnualHeatingDemandEnergySavings(homeData, windowType);
          this.calculateAnnualHeatingFinancialSavings(homeData, windowType);
          this.calculateAnnualCoolingDemandEnergySavings(homeData, windowType);
          this.calculateAnnualCoolingFinancialSavings(homeData, windowType);
          this.calculateTotalAnnualFinancialSavings(homeData, windowType);

          this.calculateProductLifespan(FrameTypeEnum.ALUMINUM, windowType); // TODO: Fix frame type

          this.calculateLifetimeSavings(windowType);

          this.calculatePaybackDate(windowType);
        }

        console.log("report loaded")
        this.loaded = true;
      }
    });

    this.calculationService.loadDataTables();
  }

  calculatePaybackDate(retrofitWindowType: RetrofitWindowType) {
    let currentYear = new Date().getFullYear();
    this.paybackDates[retrofitWindowType] = currentYear + (this.upfrontCost[retrofitWindowType] / this.totalSavings[retrofitWindowType]);
  }

  calculateProductLifespan(frame: FrameTypeEnum, retrofitWindowType: RetrofitWindowType) {
    this.productLifespan[retrofitWindowType] = this.calculationService.getProductLifespan(frame, retrofitWindowType)
  }

  calculateLifetimeSavings(retrofitWindowType: RetrofitWindowType) {
    this.lifetimeSavings[retrofitWindowType] = this.totalSavings[retrofitWindowType] * this.productLifespan[retrofitWindowType];
  }

  calculateAnnualHeatingDemandEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let deltaQth = this.financialCalculator.calculateHeatTransmission_HeatingSeason(homeData, retrofitWindowType);
    let deltaQsh = this.financialCalculator.calculateInfiltrationHeatLoss_HeatingSeason(homeData, retrofitWindowType);
    let deltaQvh = this.financialCalculator.calculateSolarHeatGain_HeatingSeason(homeData, retrofitWindowType);

    this.deltaQh[retrofitWindowType] = deltaQth + deltaQvh - deltaQsh;
  }

  calculateAnnualHeatingFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let energyCoeff = this.calculationService.getHeatingSystemEfficiency(homeData.heatingSystem);
    let fuelConversionFactor = this.calculationService.getHeatingFuelConversionFactor(homeData.heatingSystem);
    let energyPrice = this.calculationService.getHeatingEnergyPricePerUnit(homeData.heatingSystem);

    this.heatSavings[retrofitWindowType] = (this.deltaQh[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateAnnualCoolingDemandEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let deltaQtc = this.financialCalculator.calculateHeatTransmission_CoolingSeason(homeData, retrofitWindowType);
    let deltaQsc = this.financialCalculator.calculateInfiltrationHeatLoss_CoolingSeason(homeData, retrofitWindowType);
    let deltaQvc = this.financialCalculator.calculateSolarHeatGain_CoolingSeason(homeData, retrofitWindowType);

    this.deltaQc[retrofitWindowType] = deltaQtc + deltaQvc - deltaQsc;
  }

  calculateAnnualCoolingFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let energyCoeff = this.calculationService.getCoolingSystemEfficiency(homeData.coolingSystem);
    let fuelConversionFactor = this.calculationService.getCoolingFuelConversionFactor(homeData.coolingSystem);
    let energyPrice = this.calculationService.getCoolingEnergyPricePerUnit(homeData.coolingSystem);

    this.coolSavings[retrofitWindowType] = (this.deltaQh[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateTotalAnnualFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    this.totalSavings[retrofitWindowType] = this.heatSavings[retrofitWindowType] + this.coolSavings[retrofitWindowType];
  }
}
