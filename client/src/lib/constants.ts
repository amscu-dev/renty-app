import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
} from "lucide-react";

export enum AmenityEnum {
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

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Dishwasher: Waves,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Home,
  WalkInClosets: Maximize,
  Microwave: Tv,
  Refrigerator: Thermometer,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

export enum HighlightEnum {
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

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Heating: Thermometer,
  SmokeFree: Cigarette,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

export enum PropertyTypeEnum {
  Rooms = "Rooms",
  Tinyhouse = "Tinyhouse",
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  Cottage = "Cottage",
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  Rooms: Home,
  Tinyhouse: Warehouse,
  Apartment: Building,
  Villa: Castle,
  Townhouse: Home,
  Cottage: Trees,
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52; // in pixels
export const HERO_PLACEHOLDER_BG =
  "url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIABEAGQMBEQACEQEDEQH/xAAwAAEAAwEAAAAAAAAAAAAAAAAIBQcJCgEAAgMBAQAAAAAAAAAAAAAABAgCBgcFA//aAAwDAQACEAMQAAAAr9btKQBVw0sz9cZ0scGtSJDePJMdFgUsv4nSq1OnZdlq2xA6kXZi/wD/xAAtEAACAgIBAQYDCQAAAAAAAAAEBQMGAgcBEwAICRUWtRB21hg0ODlVWHSTl//aAAgBAQABPwDbGy94ernV1j9LZqQLCnrLJK2e2o59kc+scqXONON6SljLUrT5uIosM3AxUQIkOAq+WXmEbPQne52+4uyXVE2u49qLC52qYCUI4OaKuNSq+cMXgV6nLRxcLYlIRGJA8sJuWMIsMIpgRA4sckHiPXvm7LM1mxTzOFRCsGUDB4JnUcMFnXXWNdMOklMxDiXOieBRsS4OWcy5bFLyonwkI6v2+rj+4dB/Tf8A6C7Urw39G7119ZN2Jbvg3p7/AGNFZLMxrplou3JJeN9lsRIEas9DQwKijZs48Q2zeS3Nx4evK75iiBxlzjNO0noLZPmlA0Fhrq8HtogOVHFyOBsFpZBpmVbgOhrvAl/M4M5Xn5i4M5m0a3CaIaPozTSdefY3dzXVzWDdnqN5u6Hc3qeQwHWF8w1izSkiPzpFz/PC5HCrRVKbgQMw6IfFEuPOKL45KNjlMwOw8i8SX9Huv+ma0+o+3hV/lY7B+Vdse0tuzP8AGnr35Lrnts3bvF/dU38gD21d8P/EADIRAAICAQEDBREAAAAAAAAAAAIDAQQFEgAGEQcTFyHVEBUjNDVBQlJUcXOEkpOxs8L/2gAIAQIBAT8Aw+Gt4/IbwThN5scq1ds2cjZxGdxjAWTRVJPhF+m1TXLQpEwcMrSaxiJZJEUxNHEZ+lfRdx9LF1IWLrLqlPItbisg9tQ6MPBDK1U8c4EWTEGBzoa5RDUyASUbwcr97CXaVhF7MsaizFO3Ut1yp4hbAc9bVEakv59SxUzRbQUqgRCWiemQLpB3/wDUH7t/sTZFJE+EbRFVx1Y16zVC3Eti5AJk44zMkk54jIAURMrKeMaobiRdAAqHSCVaAEAFdevpKC49YkMapHr4QMHw83XMb28m1LeCotDkUylFnvgEzWNEOsgOqIdNZqhsLJoazRYI6rWSLrCGsAdHRVvL7a36w7Q2yHlEPl/52HxVvxw/SnYfR9xfmO5//8QAMxEAAgIBAQUFAw0AAAAAAAAAAgMBBAURAAYTFCIHEiEjMhAzNDZUVnN0gZKUsbPB0+L/2gAIAQMBAT8Af2s7kbyOxOAz+FyAWMNXjFKy2Fy6hJi6rGCUlQyKzSDDkDbMjaFRdQxIQA6Oz+6t7EORYzGTyDD5dFK3dxYBlKVVdpeQ4PNVX3VZNJ2K6WEprKxyqHEmzMyK5vXZ47LMWQNbbb46SmQgoa2DEoj0xEwXq10gfGNubn52v8TP6tg3arVc0zLhc5mDsvc1YQJpOX699cQydIWJl4a6wcRroIGQDe7UMdhH8ueOKr50qPnWDWsNZER5akL4jCiB04ceMgJRpBDIxDt+d0c5W5UDHEW2th8i2IITMTNcSyU9cC2eqJKRAyGJ0hndLbQ/pJW/Mf72qfC/cf6bdqny+pfYEfztmPeVfrFfsh7P/9k=)";
export const MAP_PLACEHOLDER_BG =
  "url(data:image/jpeg;base64,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)";
// Test users for development
export const testUsers = {
  tenant: {
    username: "Carol White",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "carol.white@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  tenantRole: "tenant",
  manager: {
    username: "John Smith",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "john.smith@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  managerRole: "manager",
};
