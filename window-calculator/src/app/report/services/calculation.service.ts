import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { FinancialCalculator } from '../financial-calculator';
import { WindowPropertiesModel } from '../../data-collection/user-data/window-properties-model';
import { NewFrameType, RetrofitWindowType } from '../retrofit-window';
import { CoolingSystemEnum, HeatingSystemEnum, WindowDataModel } from '../../data-collection/user-data/window-data-model';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  userInputFrameMaterial: NewFrameType = NewFrameType.METAL;
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

  constructor(private dataService: DataService, private financialCalculator: FinancialCalculator) {}

  calculateUpfrontCost(windowData: WindowPropertiesModel[], windowType: RetrofitWindowType) {
    if (windowType == RetrofitWindowType.ENERGY_STAR) {
      // Low: number of windows * price per (low)
      // High: number of windows * price per (high)
      let pricePerLow = this.dataService.getEnergyStarUpfrontCost(this.userInputFrameMaterial, true);
      let pricePerHigh = this.dataService.getEnergyStarUpfrontCost(this.userInputFrameMaterial, false);
      let numWindows = windowData[0].simplified ? 16 : windowData.length; // If using simplified data, default to 16 windows

      this.upfrontCost_low[windowType] = pricePerLow * numWindows;
      this.upfrontCost_high[windowType] = pricePerHigh * numWindows;
    } else if (windowType == RetrofitWindowType.STORM) {
      let pricePerLow = this.dataService.getStormUpfrontCost(true);
      let pricePerHigh = this.dataService.getStormUpfrontCost(false);
      let numWindows = windowData[0].simplified ? 16 : windowData.length; // If using simplified data, default to 16 windows

      let totalArea = 0;
      for (let window of windowData) {
        totalArea += window.area;
      }

      this.upfrontCost_low[windowType] = (pricePerLow * totalArea) + (100 * numWindows);
      this.upfrontCost_high[windowType] = (pricePerHigh * totalArea) + (100 * numWindows);
    } else {
      // Low: total area * price per (low)
      // High: total area * price per (high)
      let pricePerLow = this.dataService.getFilmUpfrontCost(true);
      let pricePerHigh = this.dataService.getFilmUpfrontCost(false);
      let totalArea = 0;
      for (let window of windowData) {
        totalArea += window.area;
      }

      this.upfrontCost_low[windowType] = pricePerLow * totalArea;
      this.upfrontCost_high[windowType] = pricePerHigh * totalArea;
    }
  }

  calculateOperativeTemperature(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    this.operativeTemp[retrofitWindowType] = this.dataService.getUpgradeOperativeTempIncrease(homeData.windowProperties[0].frame, retrofitWindowType);
  }

  calculateExistingOperativeTemperature(homeData: WindowDataModel) {
    this.existingOperativeTemp = this.dataService.getExistingOperativeTempIncrease(homeData.windowProperties[0].frame, homeData.windowProperties[0].glass);
  }

  calculateUpfrontCarbonImpact(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let frameGWP = this.calculateFrameGWP(homeData.windowProperties, retrofitWindowType);
    let glazeGWP = this.calculateGlazeGWP(homeData.windowProperties, retrofitWindowType);
    this.upfrontCarbonImpact[retrofitWindowType] = frameGWP + glazeGWP;
  }

  calculateFrameGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mf = this.dataService.getRetrofitFrameGWP(this.userInputFrameMaterial, retrofitWindowType);
    let Pt = 0;
    for (let window of windowData) {
      Pt += window.perimeter;
    }

    return Mf * Pt;
  }

  calculateGlazeGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mg = this.dataService.getRetrofitGlazeGWP(retrofitWindowType);
    let At = 0;
    for (let window of windowData) {
      At += window.area;
    }

    return Mg * At;
  }

  calculateLifetimeEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let heatingSavings = this.calculateLifetimeOperationalHeatingSavings_noLifespan(homeData.heatingSystem, retrofitWindowType) * this.productLifespan[retrofitWindowType];
    let coolingSavings = this.calculateLifetimeOperationalCoolingSavings_noLifespan(homeData.coolingSystem, retrofitWindowType) * this.productLifespan[retrofitWindowType];
    this.lifetimeEnergySavings[retrofitWindowType] = heatingSavings + coolingSavings;
  }

  calculateLifetimeOperationalHeatingSavings_noLifespan(heatingSystem: HeatingSystemEnum, windowType: RetrofitWindowType): number {
    let deltaQh = this.deltaQh[windowType];
    let Eh = this.dataService.getHeatingSystemEfficiency(heatingSystem);
    let Fh = this.dataService.getHeatingFuelConversionFactor(heatingSystem);
    let Xh = this.dataService.getHeatingOperationalCarbonConversionFactor(heatingSystem);

    return (deltaQh / Eh) * Fh * Xh;
  }

  calculateLifetimeOperationalCoolingSavings_noLifespan(coolingSystem: CoolingSystemEnum, windowType: RetrofitWindowType): number {
    let deltaQc = this.deltaQc[windowType];
    let Ec = this.dataService.getCoolingSystemEfficiency(coolingSystem);
    let Fc = this.dataService.getCoolingFuelConversionFactor(coolingSystem);
    let Xc = this.dataService.getCoolingOperationalCarbonConversionFactor(coolingSystem);

    return (deltaQc / Ec) * Fc * Xc;
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
    this.productLifespan[retrofitWindowType] = this.dataService.getProductLifespan(frame, retrofitWindowType)
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
    let energyCoeff = this.dataService.getHeatingSystemEfficiency(homeData.heatingSystem);
    let fuelConversionFactor = this.dataService.getHeatingFuelConversionFactor(homeData.heatingSystem);
    let energyPrice = this.dataService.getHeatingEnergyPricePerUnit(homeData.heatingSystem);

    this.heatSavings[retrofitWindowType] = (this.deltaQh[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateAnnualCoolingDemandEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let deltaQtc = this.financialCalculator.calculateHeatTransmission_CoolingSeason(homeData, retrofitWindowType);
    let deltaQvc = this.financialCalculator.calculateInfiltrationHeatLoss_CoolingSeason(homeData, retrofitWindowType);
    let deltaQsc = this.financialCalculator.calculateSolarHeatGain_CoolingSeason(homeData, retrofitWindowType);

    this.deltaQc[retrofitWindowType] = deltaQtc + deltaQvc + deltaQsc;
  }

  calculateAnnualCoolingFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let energyCoeff = this.dataService.getCoolingSystemEfficiency(homeData.coolingSystem);
    let fuelConversionFactor = this.dataService.getCoolingFuelConversionFactor(homeData.coolingSystem);
    let energyPrice = this.dataService.getCoolingEnergyPricePerUnit(homeData.coolingSystem);

    this.coolSavings[retrofitWindowType] = (this.deltaQc[retrofitWindowType] / energyCoeff) * fuelConversionFactor * energyPrice;
  }

  calculateTotalAnnualFinancialSavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    this.totalSavings[retrofitWindowType] = this.heatSavings[retrofitWindowType] + this.coolSavings[retrofitWindowType];
  }
}
