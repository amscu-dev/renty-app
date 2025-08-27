import { Types } from "mongoose";

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
  properties: Types.ObjectId;
  fullAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialLocationWithId extends Partial<ILocation> {
  _id: string;
}
