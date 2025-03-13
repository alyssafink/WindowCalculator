import { Injectable } from "@angular/core";
import { WindowDataModel } from "../data-collection/user-data/window-data-model";
import { RetrofitWindowType } from "./retrofit-window";
import { DataService } from "./services/data.service";

@Injectable({
  providedIn: 'root'
})
export class FinancialCalculator {
  constructor(private dataService: DataService) {}

  calculateHeatTransmission_HeatingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const Ft: number = 1; // Simplify heat transfer to 1
    let Gth = this.dataService.getHeatingDegreeHours(homeData.heatingSetPoint);

    let deltaQth = 0;
    for (let window of homeData.windowProperties) {
      let Uo = this.dataService.getExistingWindowUValue(window.glass, window.frame);
      let Ur = this.dataService.getRetrofitUValue(window.frame, retrofitWindowType);

      let windowQth = window.area * (Uo - Ur) * Ft * Gth;
      deltaQth += windowQth;
    }

    return deltaQth;
  }

  calculateInfiltrationHeatLoss_HeatingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const PRESSURE = Math.pow(50, 0.8);
    const MIN_PER_HR = 60;
    const AIR_SPECIFIC_HEAT_CAPACITY = 0.018;
    let Gth = this.dataService.getHeatingDegreeHours(homeData.heatingSetPoint);
    let nFactor = this.dataService.getNFactor(homeData.homeHeight, homeData.windShielding);

    let deltaQvh = 0;
    for (let window of homeData.windowProperties) {
      let Fo = this.dataService.getExistingWindowFlowCoefficient(window.operability);
      let Fr = this.dataService.getRetrofitFlowCoefficient(window.operability, retrofitWindowType);

      let windowQvh = ((Fo - Fr) * PRESSURE * window.perimeter * MIN_PER_HR * AIR_SPECIFIC_HEAT_CAPACITY * Gth) / nFactor;
      deltaQvh += windowQvh;
    }

    return deltaQvh;
  }

  calculateSolarHeatGain_HeatingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const SHADING_REDUCTION = 0.8;

    let deltaQsh = 0;
    for (let window of homeData.windowProperties) {
      let existingHeatGainCoeff = this.dataService.getSolarHeatGainCoefficient(window.glass, window.frame);
      let retrofitHeadGainCoeff = this.dataService.getRetrofitHeatGainCoefficient(window.operability, window.frame, retrofitWindowType);
      let solarRadiation = 0;
      if (!window.simplified) {
        solarRadiation = this.dataService.getHeatingSeasonSolarRadiation(window.orientation, homeData.heatingSetPoint);
      }
      else {
        solarRadiation = this.dataService.getHeatingSeasonSolarRadiation_simp(window.orientation, homeData.heatingSetPoint);
      }

      let windowQsh = SHADING_REDUCTION * (existingHeatGainCoeff - retrofitHeadGainCoeff) * window.area * solarRadiation;
      deltaQsh += windowQsh;
    }

    return deltaQsh;
  }

  calculateHeatTransmission_CoolingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const Ft: number = 1; // Simplify heat transfer to 1
    let Gtc = this.dataService.getCoolingDegreeHours(homeData.coolingSetPoint);

    let deltaQtc = 0;
    for (let window of homeData.windowProperties) {
      let Uo = this.dataService.getExistingWindowUValue(window.glass, window.frame);
      let Ur = this.dataService.getRetrofitUValue(window.frame, retrofitWindowType);

      let windowQtc = window.area * (Uo - Ur) * Ft * Gtc;
      deltaQtc += windowQtc;
    }

    return deltaQtc;
  }

  calculateInfiltrationHeatLoss_CoolingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const PRESSURE = Math.pow(50, 0.8);
    const MIN_PER_HR = 60;
    const AIR_SPECIFIC_HEAT_CAPACITY = 0.018;
    let Gtc = this.dataService.getCoolingDegreeHours(homeData.coolingSetPoint);
    let nFactor = this.dataService.getNFactor(homeData.homeHeight, homeData.windShielding);

    let deltaQvc = 0;
    for (let window of homeData.windowProperties) {
      let Fo = this.dataService.getExistingWindowFlowCoefficient(window.operability);
      let Fr = this.dataService.getRetrofitFlowCoefficient(window.operability, retrofitWindowType);

      let windowQvc = ((Fo - Fr) * PRESSURE * window.perimeter * MIN_PER_HR * AIR_SPECIFIC_HEAT_CAPACITY * Gtc) / nFactor;
      deltaQvc += windowQvc;
    }

    return deltaQvc;
  }

  calculateSolarHeatGain_CoolingSeason(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType): number {
    const SHADING_REDUCTION = 0.8;

    let deltaQsc = 0;
    for (let window of homeData.windowProperties) {
      let existingHeatGainCoeff = this.dataService.getSolarHeatGainCoefficient(window.glass, window.frame);
      let retrofitHeadGainCoeff = this.dataService.getRetrofitHeatGainCoefficient(window.operability, window.frame, retrofitWindowType);
      let solarRadiation = 0;
      if (!window.simplified) {
        solarRadiation = this.dataService.getCoolingSeasonSolarRadiation(window.orientation, homeData.coolingSetPoint);
      }
      else {
        solarRadiation = this.dataService.getCoolingSeasonSolarRadiation_simp(window.orientation, homeData.coolingSetPoint);
      }

      let windowQsc = SHADING_REDUCTION * (existingHeatGainCoeff - retrofitHeadGainCoeff) * window.area * solarRadiation;
      deltaQsc += windowQsc;
    }

    return deltaQsc;
  }
}
