export interface ITenant {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  applications?: string[];
  leases?: string[];
  favorites?: string[];
  properties?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPartialTentantWithId extends Partial<ITenant> {
  _id: string;
}
