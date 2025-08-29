import { Types } from "mongoose";

export enum Amenity {
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Dishwasher = "Dishwasher",
  HighSpeedInternet = "HighSpeedInternet",
  HardwoodFloors = "HardwoodFloors",
  WalkInClosets = "WalkInClosets",
  Microwave = "Microwave",
  Refrigerator = "Refrigerator",
  Pool = "Pool",
  Gym = "Gym",
  Parking = "Parking",
  PetsAllowed = "PetsAllowed",
  WiFi = "WiFi",
}

export enum PropertyType {
  Rooms = "Rooms",
  Tinyhouse = "Tinyhouse",
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  Cottage = "Cottage",
}

export enum Highlight {
  HighSpeedInternetAccess = "HighSpeedInternetAccess",
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Heating = "Heating",
  SmokeFree = "SmokeFree",
  CableReady = "CableReady",
  SatelliteTV = "SatelliteTV",
  DoubleVanities = "DoubleVanities",
  TubShower = "TubShower",
  Intercom = "Intercom",
  SprinklerSystem = "SprinklerSystem",
  RecentlyRenovated = "RecentlyRenovated",
  CloseToTransit = "CloseToTransit",
  GreatView = "GreatView",
  QuietNeighborhood = "QuietNeighborhood",
}

export interface IProperty {
  name: string;
  description: string;
  pricePerMonth: number;
  securityDeposit: number;
  applicationFee: number;
  amenities: Amenity[];
  highlights: Highlight[];
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: PropertyType;
  isPetsAllowed: boolean;
  postedDate: Date;
  isParkingIncluded: boolean;
  photoUrls: string[];
  averageRating?: number;
  numberOfReviews?: number;
  managerCognitoId: string;
  manager: Types.ObjectId;
  location: Types.ObjectId;
  applications: Types.ObjectId[];
  leases: Types.ObjectId[];
  favoritedBy: Types.ObjectId[];
  tenants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialPropertyWithId extends Partial<IProperty> {
  _id: Types.ObjectId;
}

interface dataType {
  lat: number;
  lon: number;
  formatted: string;
}

export interface GEO_API_REPONSE_TYPE {
  data: {
    results: dataType[];
  };
}
