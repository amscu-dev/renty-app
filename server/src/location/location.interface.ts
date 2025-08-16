import { HydratedDocument, PopulatedDoc } from "mongoose";
import { IProperty } from "../property/property.interface";

export interface ILocation {
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  coordinates: {
    type: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  properties: PopulatedDoc<HydratedDocument<IProperty>>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialLocationWithId extends Partial<ILocation> {
  _id: string;
}
