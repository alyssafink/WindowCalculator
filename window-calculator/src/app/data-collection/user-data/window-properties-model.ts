export class WindowPropertiesModel {
  // if user selects simplified version, there is only one window properties
  // model with assumed dmensions applied
  // Otherwise, allow the user to add as many as they want of full objects (table)
  // width: number; // pre-convert to ft
  // height: number; // pre-convert to ft
  name: string = "";
  width: number;
  height: number;
  area: number // set to 247 ft2 if simplified
  perimeter: number // set to 256 ft if simplified
  glass: GlassTypeEnum;
  frame: FrameTypeEnum;
  operability: OperabilityTypeEnum;
  orientation: OrientationTypeEnum;
  simplified: boolean = false;
}

export enum OperabilityTypeEnum {
  FIXED = "Fixed",
  AWNING_SINGLE = "Awning Window (Single Sash)",
  AWNING_MULTI = "Awning Window (Multiple Sash)",
  VERT_PRE = "Vertical Slider (Pre-1970)",
  VERT_POST = "Vertical Slider (Post-1970)",
  HORIZ = "Horizontal Slider"
}

export enum GlassTypeEnum {
  CLEAR = "Clear",
  TINTED = "Tinted",
  LOW_E = "Low-E"
}

export enum FrameTypeEnum {
  METAL = "Metal",
  METAL_TB = "Metal with Thermal Break",
  WOOD = "Wood",
  VINYL = "Vinyl"
}

export enum OrientationTypeEnum {
  NORTH = "North",
  SOUTH = "South",
  EAST = "East",
  WEST = "West",
  EVEN = "Evenly Distributed"
}
