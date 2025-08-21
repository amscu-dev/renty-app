export type IManager = {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  managedProperties: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IPartialManagerWithId = Partial<IManager> & {
  _id: string;
};
