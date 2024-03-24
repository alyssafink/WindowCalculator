import { Injectable } from '@angular/core';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum } from '../../data-collection/user-data/window-properties-model';
import { RetrofitWindowType } from '../retrofit-window';
import { CoolingSystemEnum, HeatingSystemEnum, WindShieldingEnum } from '../../data-collection/user-data/window-data-model';
import { readFileSync } from "fs-web";
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private lock = new BehaviorSubject('');
  observableLock = this.lock.asObservable();

  // U-Value Data Tables
  existingWindowUValueData: any[];
  stormWindowUValueData: any[];
  energyStarUValueData: any[];
  filmUValueData: any[];

  // SHGC Data Tables
  existingWindowSHGCData: any[];
  stormWindowSHGCData: any[];
  energyStarSHGCData: any[];
  filmSHGCData: any[];

  // Degree Hours Data Tables
  heatingDegreeHoursData: any[];
  coolingDegreeHoursData: any[];

  // Window Flow Coefficient Data Tables
  existingWindowFlowData: any[];
  stormWindowFlowData: any[];
  energyStarFlowData: any[];
  filmFlowData: any[];

  // N-Factor Data Tables
  nFactorData: any[];

  // Energy Price Data Tables
  heatingEnergyPriceData: any[];
  coolingEnergyPriceData: any[];

  // HVAC System Data Tables
  hvacSystemEfficiencyData: any[];
  hvacFuelConversionData: any[];

  // Solar Radiation Data Tables
  heatingSeasonSolarRadiationData: any[];
  coolingSeasonSolarRadiationData: any[];

  // Window Orientation Data Tables
  windowOrientationDistributionData: any[];

  // Product Lifespan Data Tables
  stormWindowLifespanData: any[];
  energyStarWindowLifespanData: any[];
  filmWindowLifespanData: any[];



  constructor(private httpClient: HttpClient) {}

   loadDataTables() {
    forkJoin([
      this.httpClient.get('assets/data-tables/ExistingWindowUValue.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/StormWindowUValue.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/EnergyStarUValue.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/FilmUValue.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/ExistingWindowSHGC.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/StormWindowSHGC.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/EnergyStarSHGC.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/FilmSHGC.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/HeatingDegreeHours.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/CoolingDegreeHours.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/ExistingWindowFlow.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/StormWindowFlow.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/EnergyStarWindowFlow.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/FilmWindowFlow.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/NFactor.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/HeatingEnergyPrice.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/CoolingEnergyPrice.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/HvacSystemEfficiency.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/HvacFuelConversion.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/HeatingSeasonSolarRadiation.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/CoolingSeasonSolarRadiation.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/WindowOrientationDistribution.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/StormWindowLifespan.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/EnergyStarWindowLifespan.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/FilmWindowLifespan.csv', { responseType: 'text' }),
    ]).subscribe(([
      existingWindowUValueDataString,
      stormWindowUValueDataString,
      energyStarWindowUValueDataString,
      filmUValueDataString,
      existingWindowSHGCDataString,
      stormWindowSHGCDataString,
      energyStarSHGCDataString,
      filmSHGCDataString,
      heatingDegreeHoursDataString,
      coolingDegreeHoursDataString,
      existingWindowFlowDataString,
      stormWindowFlowDataString,
      energyStarWindowFlowDataString,
      filmWindowFlowDataString,
      nFactorDataString,
      heatingEnergyPriceDataString,
      coolingEnergyPriceDataString,
      hvacSystemEfficiencyDataString,
      hvacFuelConversionDataString,
      heatingSeasonSolarRadiationDataString,
      coolingSeasonSolarRadiationDataString,
      windowOrientationDistributionDataString,
      stormWindowLifespanDataString,
      energyStarWindowLifespanDataString,
      filmWindowLifespanDataString
    ]) => {
      this.existingWindowUValueData = d3.csvParse(existingWindowUValueDataString);
      this.stormWindowUValueData = d3.csvParse(stormWindowUValueDataString);
      this.energyStarUValueData = d3.csvParse(energyStarWindowUValueDataString);
      this.filmUValueData = d3.csvParse(filmUValueDataString);
      this.existingWindowSHGCData = d3.csvParse(existingWindowSHGCDataString);
      this.stormWindowSHGCData = d3.csvParse(stormWindowSHGCDataString);
      this.energyStarSHGCData = d3.csvParse(energyStarSHGCDataString);
      this.filmSHGCData = d3.csvParse(filmSHGCDataString);
      this.heatingDegreeHoursData = d3.csvParse(heatingDegreeHoursDataString);
      this.coolingDegreeHoursData = d3.csvParse(coolingDegreeHoursDataString);
      this.existingWindowFlowData = d3.csvParse(existingWindowFlowDataString);
      this.stormWindowFlowData = d3.csvParse(stormWindowFlowDataString);
      this.energyStarFlowData = d3.csvParse(energyStarWindowFlowDataString);
      this.filmFlowData = d3.csvParse(filmWindowFlowDataString);
      this.nFactorData = d3.csvParse(nFactorDataString);
      this.hvacSystemEfficiencyData = d3.csvParse(hvacSystemEfficiencyDataString);
      this.hvacFuelConversionData = d3.csvParse(hvacFuelConversionDataString);
      this.heatingEnergyPriceData = d3.csvParse(heatingEnergyPriceDataString);
      this.coolingEnergyPriceData = d3.csvParse(coolingEnergyPriceDataString);
      this.heatingSeasonSolarRadiationData = d3.csvParse(heatingSeasonSolarRadiationDataString);
      this.coolingSeasonSolarRadiationData = d3.csvParse(coolingSeasonSolarRadiationDataString);
      this.windowOrientationDistributionData = d3.csvParse(windowOrientationDistributionDataString);
      this.energyStarWindowLifespanData = d3.csvParse(energyStarWindowLifespanDataString);
      this.stormWindowLifespanData = d3.csvParse(stormWindowLifespanDataString);
      this.filmWindowLifespanData = d3.csvParse(filmWindowLifespanDataString);
      this.lock.next('Data Tables Loaded');
    });
   }

  getExistingWindowUValue(glaze: GlassTypeEnum, frame: FrameTypeEnum): number {
    var result = this.existingWindowUValueData.filter(function(item) {
      return item["Glazing Type"] == GlassTypeEnum[glaze];
    }).find(function(item) { return item["Frame Material"] == FrameTypeEnum[frame]; } );
    return +result["U-value"];
  }

  getRetrofitUValue(frame: FrameTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarUValueData.find(function(item) {
        return item["Frame Material"] == FrameTypeEnum[frame];
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowUValueData.find(function(item) {
        return item["Frame Material"] == FrameTypeEnum[frame];
      });
    } else {
      result = this.filmUValueData.find(function(item) {
        return item["Frame Material"] == FrameTypeEnum[frame];
      });
    }

    return +result["U-value"];
  }

  getHeatingDegreeHours(heatingSetPoint: number): number {
    var result = this.heatingDegreeHoursData.find(function(item) {
      return item["Heating Setpoint"] == heatingSetPoint;
    });

    return +result["Heating Degree Hours"];
  }

  getCoolingDegreeHours(coolingSetPoint: number): number {
    var result = this.coolingDegreeHoursData.find(function(item) {
      return item["Cooling Setpoint"] == coolingSetPoint;
    });

    return +result["Cooling Degree Hours"];
  }

  getExistingWindowFlowCoefficient(operability: OperabilityTypeEnum): number {
    var result = this.existingWindowFlowData.find(function(item) {
      return item["Operability"] == OperabilityTypeEnum[operability];
    });

    return +result["Flow coefficient"];
  }

  getRetrofitFlowCoefficient(operability: OperabilityTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarFlowData.find(function(item) {
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowFlowData.find(function(item) {
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    } else {
      result = this.filmFlowData.find(function(item) {
        // TODO: Grab data when done
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    }

    return +result["Flow coefficient"];
  }

  getNFactor(homeHeight: number, windShielding: WindShieldingEnum): number {
    var result = this.nFactorData.filter(function(item) {
      return item["Wind Shielding"] == WindShieldingEnum[windShielding];
    }).find(function(item) { return item["Number of Stories"] == homeHeight; } );

    return +result["N-factor"];
  }

  getSolarHeatGainCoefficient(glaze: GlassTypeEnum, frame: FrameTypeEnum): number {
    var result = this.existingWindowSHGCData.find(function(item) {
      return item["Glazing Type"] == GlassTypeEnum[glaze];
    });

    return +result[FrameTypeEnum[frame]];
  }

  getRetrofitHeatGainCoefficient(operability: OperabilityTypeEnum, frame: FrameTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarSHGCData.find(function(item) {
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowSHGCData.find(function(item) {
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    } else {
      result = this.filmSHGCData.find(function(item) {
        return item["Operability"] == OperabilityTypeEnum[operability];
      });
    }

    return +result[FrameTypeEnum[frame]];
  }

  getHeatingSeasonSolarRadiation(orientation: OrientationTypeEnum, heatingSetPoint: number): number {
    var result = this.heatingSeasonSolarRadiationData.find(function(item) {
      return item["Heating Setpoint"] == heatingSetPoint;
    });

    return +result[OrientationTypeEnum[orientation]];
  }

  getHeatingSeasonSolarRadiation_simp(orientation: OrientationTypeEnum, heatingSetPoint: number): number {
    var radiationResult = this.heatingSeasonSolarRadiationData.find(function(item) {
      return item["Heating Setpoint"] == heatingSetPoint;
    });

    var orientationResult = this.windowOrientationDistributionData.find(function(item) {
      return item["Primary Orientation"] == OrientationTypeEnum[orientation];
    });

    return ((+radiationResult["NORTH"]) * (+orientationResult["NORTH"])) +
      ((+radiationResult["SOUTH"]) * (+orientationResult["SOUTH"])) +
      ((+radiationResult["EAST"]) * (+orientationResult["EAST"])) +
      ((+radiationResult["WEST"]) * (+orientationResult["WEST"]));
  }

  getCoolingSeasonSolarRadiation(orientation: OrientationTypeEnum, coolingSetPoint: number): number {
    var result = this.coolingSeasonSolarRadiationData.find(function(item) {
      return item["Cooling Setpoint"] == coolingSetPoint;
    });

    return +result[OrientationTypeEnum[orientation]];
  }

  getCoolingSeasonSolarRadiation_simp(orientation: OrientationTypeEnum, coolingSetPoint: number): number {
    var radiationResult = this.coolingSeasonSolarRadiationData.find(function(item) {
      return item["Cooling Setpoint"] == coolingSetPoint;
    });

    var orientationResult = this.windowOrientationDistributionData.find(function(item) {
      return item["Primary Orientation"] == OrientationTypeEnum[orientation];
    });

    return ((+radiationResult["NORTH"]) * (+orientationResult["NORTH"])) +
      ((+radiationResult["SOUTH"]) * (+orientationResult["SOUTH"])) +
      ((+radiationResult["EAST"]) * (+orientationResult["EAST"])) +
      ((+radiationResult["WEST"]) * (+orientationResult["WEST"]));
  }

  getHeatingSystemEfficiency(heatingSystem: HeatingSystemEnum): number {
    var result = this.hvacSystemEfficiencyData.find(function(item) {
      return item["System"] == HeatingSystemEnum[heatingSystem];
    });

    return +result["Heating Efficiency"];
  }

  getCoolingSystemEfficiency(coolingSystem: CoolingSystemEnum): number {
    var result = this.hvacSystemEfficiencyData.find(function(item) {
      return item["System"] == CoolingSystemEnum[coolingSystem];
    });

    return +result["Cooling Efficiency"];
  }

  getHeatingFuelConversionFactor(heatingSystem: HeatingSystemEnum): number {
    var result = this.hvacFuelConversionData.find(function(item) {
      return item["System"] == HeatingSystemEnum[heatingSystem];
    });

    return +result["Conversion Factor"];
  }

  getCoolingFuelConversionFactor(coolingSystem: CoolingSystemEnum): number {
    var result = this.hvacFuelConversionData.find(function(item) {
      return item["System"] == CoolingSystemEnum[coolingSystem];
    });

    return +result["Conversion Factor"];
  }

  getHeatingEnergyPricePerUnit(heatingSystem: HeatingSystemEnum): number {
    var result = this.heatingEnergyPriceData.find(function(item) {
      return item["Source"] == HeatingSystemEnum[heatingSystem]
    });

    return +result.Price;
  }

  getCoolingEnergyPricePerUnit(coolingSystem: CoolingSystemEnum): number {
    var result = this.coolingEnergyPriceData.find(function(item) {
      return item["Source"] == CoolingSystemEnum[coolingSystem]
    });

    return +result.Price;
  }

  // TODO: Test this
  getProductLifespan(frame: FrameTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarWindowLifespanData.find(function(item) {
        return item["Product"] == FrameTypeEnum[frame];
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowLifespanData.find(function(item) {
        return item["Product"] == FrameTypeEnum[frame];
      });
    } else {
      result = this.filmWindowLifespanData.find(function(item) {
        return item["Product"] == FrameTypeEnum[frame];
      });
    }
    console.log(result)

    return +result["Lifespan"];
  }
}
