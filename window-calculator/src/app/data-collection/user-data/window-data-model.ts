import { WindowPropertiesModel } from "./window-properties-model";

export class WindowDataModel {
  // Contains user inputs
  homeName: String;
  homeHeight: number;
  heatingSystem: HeatingSystemEnum;
  coolingSystem: CoolingSystemEnum;
  heatingSetPoint: number; // 55-85 range
  coolingSetPoint: number; // 60-90 range
  windShielding: WindShieldingEnum;
  windowProperties: WindowPropertiesModel[];
}

export enum HomeHeightEnum {
  ONE = "1 Story",
  ONE_HALF = "1.5 Story",
  TWO = "2 Story",
  THREE = "3 Story"
}

export enum WindShieldingEnum {
  WELL_SHIELDED = "Well Shielded",
  TYPICAL = "Typically Shielded",
  EXPOSED = "Exposed"
}

export enum HeatingSystemEnum {
  HEAT_PUMP = "Heat Pump",
  HF_HEAT_PUMP = "High Efficiency Heat Pump",
  NATURAL_GAS = "Natural Gas Furnace",
  PROPANE = "Propane Furnace",
  ELECTRIC = "Electric Furnace"
}

export enum CoolingSystemEnum {
  HEAT_PUMP = "Heat Pump",
  HF_HEAT_PUMP = "High Efficiency Heat Pump",
  CENTRAL_AC = "Central Air Conditioning"
}
