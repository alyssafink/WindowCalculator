import { Injectable } from '@angular/core';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum } from '../../data-collection/user-data/window-properties-model';
import { NewFrameType, RetrofitWindowType } from '../retrofit-window';
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
  operationalCarbonConversionData: any[];

  // Solar Radiation Data Tables
  heatingSeasonSolarRadiationData: any[];
  coolingSeasonSolarRadiationData: any[];

  // Window Orientation Data Tables
  windowOrientationDistributionData: any[];

  // Product Lifespan Data Tables
  stormWindowLifespanData: any[];
  energyStarWindowLifespanData: any[];
  filmWindowLifespanData: any[];

  // Embodied Carbon Data Tables
  retrofitFrameGWPData: any[];
  retrofitGlazeGWPData: any[];

  // Upfront Cost Data Tables
  energyStarUpfrontCostData: any[];
  stormUpfrontCostData: any[];
  filmUpfrontCostData: any[];

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
      this.httpClient.get('assets/data-tables/FrameMaterialEmbodiedCarbon.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/GlazingMaterialEmbodiedCarbon.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/OperationalCarbonConversionFactor.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/EnergyStarUpfrontCost.csv', { responseType: 'text' }),
      //this.httpClient.get('assets/data-tables/StormUpfrontCost.csv', { responseType: 'text' }),
      this.httpClient.get('assets/data-tables/FilmUpfrontCost.csv', { responseType: 'text' }),
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
      filmWindowLifespanDataString,
      frameMaterialGWPDataString,
      glazeMaterialGWPDataString,
      operationalCarbonConversionDataString,
      energyStarUpfrontCostDataString,
      //stormUpfrontCostDataString,
      filmUpfrontCostDataString,
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
      this.retrofitFrameGWPData = d3.csvParse(frameMaterialGWPDataString);
      this.retrofitGlazeGWPData = d3.csvParse(glazeMaterialGWPDataString);
      this.operationalCarbonConversionData = d3.csvParse(operationalCarbonConversionDataString);
      this.energyStarUpfrontCostData = d3.csvParse(energyStarUpfrontCostDataString);
      //this.stormUpfrontData = d3.csvParse(stormUpfrontCostDataString);
      this.filmUpfrontCostData = d3.csvParse(filmUpfrontCostDataString);
      this.lock.next('Data Tables Loaded');
    });
   }

  getExistingWindowUValue(glaze: GlassTypeEnum, frame: FrameTypeEnum): number {
    var result = this.existingWindowUValueData.filter(function(item) {
      return item["Glazing Type"] == glaze;
    }).find(function(item) { return item["Frame Material"] == frame; } );
    return +result["U-value"];
  }

  getRetrofitUValue(frame: FrameTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarUValueData.find(function(item) {
        return item["Frame Material"] == frame;
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowUValueData.find(function(item) {
        return item["Frame Material"] == frame;
      });
    } else {
      result = this.filmUValueData.find(function(item) {
        return item["Frame Material"] == frame;
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
      return item["Operability"] == operability;
    });

    return +result["Flow coefficient"];
  }

  getRetrofitFlowCoefficient(operability: OperabilityTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarFlowData.find(function(item) {
        return item["Operability"] == operability;
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowFlowData.find(function(item) {
        return item["Operability"] == operability;
      });
    } else {
      result = this.filmFlowData.find(function(item) {
        // TODO: Grab data - currently placeholder
        return item["Operability"] == operability;
      });
    }

    return +result["Flow coefficient"];
  }

  getNFactor(homeHeight: number, windShielding: WindShieldingEnum): number {
    var result = this.nFactorData.filter(function(item) {
      return item["Wind Shielding"] == windShielding;
    }).find(function(item) { return item["Number of Stories"] == homeHeight; } );

    return +result["N-factor"];
  }

  getSolarHeatGainCoefficient(glaze: GlassTypeEnum, frame: FrameTypeEnum): number {
    var result = this.existingWindowSHGCData.find(function(item) {
      return item["Glazing Type"] == glaze;
    });

    return +result[frame];
  }

  getRetrofitHeatGainCoefficient(operability: OperabilityTypeEnum, frame: FrameTypeEnum, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarSHGCData.find(function(item) {
        return item["Operability"] == operability;
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowSHGCData.find(function(item) {
        return item["Operability"] == operability;
      });
    } else {
      result = this.filmSHGCData.find(function(item) {
        return item["Operability"] == operability;
      });
    }

    return +result[frame];
  }

  getHeatingSeasonSolarRadiation(orientation: OrientationTypeEnum, heatingSetPoint: number): number {
    var result = this.heatingSeasonSolarRadiationData.find(function(item) {
      return item["Heating Setpoint"] == heatingSetPoint;
    });

    return +result[orientation];
  }

  getHeatingSeasonSolarRadiation_simp(orientation: OrientationTypeEnum, heatingSetPoint: number): number {
    var radiationResult = this.heatingSeasonSolarRadiationData.find(function(item) {
      return item["Heating Setpoint"] == heatingSetPoint;
    });

    var orientationResult = this.windowOrientationDistributionData.find(function(item) {
      return item["Primary Orientation"] == orientation;
    });

    return ((+radiationResult["North"]) * (+orientationResult["North"])) +
      ((+radiationResult["South"]) * (+orientationResult["South"])) +
      ((+radiationResult["East"]) * (+orientationResult["East"])) +
      ((+radiationResult["West"]) * (+orientationResult["West"]));
  }

  getCoolingSeasonSolarRadiation(orientation: OrientationTypeEnum, coolingSetPoint: number): number {
    var result = this.coolingSeasonSolarRadiationData.find(function(item) {
      return item["Cooling Setpoint"] == coolingSetPoint;
    });

    return +result[orientation];
  }

  getCoolingSeasonSolarRadiation_simp(orientation: OrientationTypeEnum, coolingSetPoint: number): number {
    var radiationResult = this.coolingSeasonSolarRadiationData.find(function(item) {
      return item["Cooling Setpoint"] == coolingSetPoint;
    });

    var orientationResult = this.windowOrientationDistributionData.find(function(item) {
      return item["Primary Orientation"] == orientation;
    });

    return ((+radiationResult["North"]) * (+orientationResult["North"])) +
      ((+radiationResult["South"]) * (+orientationResult["South"])) +
      ((+radiationResult["East"]) * (+orientationResult["East"])) +
      ((+radiationResult["West"]) * (+orientationResult["West"]));
  }

  getHeatingSystemEfficiency(heatingSystem: HeatingSystemEnum): number {
    var result = this.hvacSystemEfficiencyData.find(function(item) {
      return item["System"] == heatingSystem;
    });

    return +result["Heating Efficiency"];
  }

  getCoolingSystemEfficiency(coolingSystem: CoolingSystemEnum): number {
    var result = this.hvacSystemEfficiencyData.find(function(item) {
      return item["System"] == coolingSystem;
    });

    return +result["Cooling Efficiency"];
  }

  getHeatingFuelConversionFactor(heatingSystem: HeatingSystemEnum): number {
    var result = this.hvacFuelConversionData.find(function(item) {
      return item["System"] == heatingSystem;
    });

    return +result["Conversion Factor"];
  }

  getCoolingFuelConversionFactor(coolingSystem: CoolingSystemEnum): number {
    var result = this.hvacFuelConversionData.find(function(item) {
      return item["System"] == coolingSystem;
    });

    return +result["Conversion Factor"];
  }

  getHeatingEnergyPricePerUnit(heatingSystem: HeatingSystemEnum): number {
    var result = this.heatingEnergyPriceData.find(function(item) {
      return item["Source"] == heatingSystem;
    });

    return +result.Price;
  }

  getCoolingEnergyPricePerUnit(coolingSystem: CoolingSystemEnum): number {
    var result = this.coolingEnergyPriceData.find(function(item) {
      return item["Source"] == coolingSystem;
    });

    return +result.Price;
  }

  // TODO: Test this
  getProductLifespan(frame: NewFrameType, retrofitType: RetrofitWindowType): number {
    let result;

    if (retrofitType == RetrofitWindowType.ENERGY_STAR) {
      result = this.energyStarWindowLifespanData.find(function(item) {
        return item["Product"] == NewFrameType[frame];
      });
    } else if (retrofitType == RetrofitWindowType.STORM) {
      result = this.stormWindowLifespanData.find(function(item) {
        return item["Product"] == NewFrameType[frame];
      });
    } else {
      result = this.filmWindowLifespanData.find(function(item) {
        return item["Product"] == NewFrameType[frame];
      });
    }
    console.log(result)

    return +result["Lifespan"];
  }

  // TODO: Test this
  getRetrofitFrameGWP(frame: NewFrameType, windowType: RetrofitWindowType): number {
    let result;

    if (windowType == RetrofitWindowType.ENERGY_STAR) {
      result = this.retrofitFrameGWPData.filter(function(item) {
        return item["Retrofit Type"] == "ENERGY_STAR";
      }).find(function(item) { return item["Frame Material"] == NewFrameType[frame]; } );
    } else {
      result = this.retrofitFrameGWPData.find(function(item) {
        return item["Retrofit Type"] == RetrofitWindowType[windowType];
      });
    }

    return +result["GWP"];
  }

  // TODO: Test this
  getRetrofitGlazeGWP(windowType: RetrofitWindowType): number {
    let result = this.retrofitGlazeGWPData.find(function(item) {
      return item["Retrofit Type"] == RetrofitWindowType[windowType];
    });

    return +result["GWP"];
  }

  // TODO: Test this
  getHeatingOperationalCarbonConversionFactor(heatingSystem: HeatingSystemEnum): number {
    let result = this.operationalCarbonConversionData.find(function(item) {
      return item["HVAC System"] == heatingSystem;
    });

    return +result["Conversion Factor"];
  }

  // TODO: Test this
  getCoolingOperationalCarbonConversionFactor(coolingSystem: CoolingSystemEnum): number {
    let result = this.operationalCarbonConversionData.find(function(item) {
      return item["HVAC System"] == coolingSystem;
    });

    return +result["Conversion Factor"];
  }

  // TODO: Test this
  getEnergyStarUpfrontCost(frame: NewFrameType, low: boolean): number {
    let result = this.energyStarUpfrontCostData.find(function(item) {
      return item["Frame Material"] == NewFrameType[frame];
    });

    if (low) {
      return +result["Low"];
    } else {
      return +result["High"];
    }
  }

  getStormUpfrontCost(low: boolean): number {
    if (low) {
      return 1;
    } else {
      return 1;
    }
  }

  // TODO: Test this
  getFilmUpfrontCost(low: boolean): number {
    if (low) {
      return +this.filmUpfrontCostData[0]["Low"];
    } else {
      return +this.filmUpfrontCostData[0]["High"];
    }
  }
}
