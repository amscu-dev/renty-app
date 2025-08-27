import { LucideIcon } from "lucide-react";
import { AuthUser } from "aws-amplify/auth";
import { Manager, Tenant, Property, Application } from "./tenant";
import { MotionProps as OriginalMotionProps } from "framer-motion";
import { IManager } from "./manager";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  enum AmenityEnum {
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

  enum HighlightEnum {
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

  enum PropertyTypeEnum {
    Rooms = "Rooms",
    Tinyhouse = "Tinyhouse",
    Apartment = "Apartment",
    Villa = "Villa",
    Townhouse = "Townhouse",
    Cottage = "Cottage",
  }

  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    propertyId: string;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
  }

  interface ContactWidgetProps {
    onOpenModal: () => void;
    propertyId: string;
  }

  interface ImagePreviewsProps {
    propertyId: string;
  }

  interface PropertyDetailsProps {
    propertyId: string;
  }

  interface PropertyOverviewProps {
    propertyId: string;
  }

  interface PropertyLocationProps {
    propertyId: string;
  }

  interface ApplicationCardProps {
    application: Application;
    userType: "manager" | "renter";
    children: React.ReactNode;
  }

  interface CardProps {
    property: IProperty;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface CardCompactProps {
    property: IProperty;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface DashboardPagesHeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "manager" | "tenant";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "manager" | "tenant";
  }

  type ResponseAPI<T> = {
    data: T;
    meta: { createdAt?: string; updatedAt?: string };
    status: "success";
    statusCode: number;
  };

  interface IManager {
    cognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
    managedProperties: string[];
    _id: string;
  }
  interface ITenant {
    cognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
    applications: string[];
    leases: string[];
    favorites: IProperty[];
    properties: string[];
    _id: string;
  }

  type PartialTenantWithID = Partial<Omit<ITenant, "_id" | "cognitoId">> & {
    _id: string;
    cognitoId: string;
  };
  type PartialManagerWithID = Partial<Omit<IManager, "_id" | "cognitoId">> & {
    _id: string;
    cognitoId: string;
  };
  interface TenantUser {
    userRole: "tenant";
    cognitoInfo: AuthUser;
    userInfo: ResponseAPI<ITenant>;
  }

  interface ManagerUser {
    userRole: "manager";
    cognitoInfo: AuthUser;
    userInfo: ResponseAPI<IManager>;
  }

  type User = TenantUser | ManagerUser;

  export interface ILocation {
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
    properties: PopulatedDoc<HydratedDocument<IProperty>>;
    createdAt: Date;
    updatedAt: Date;
    fullAddress: string;
  }
  export interface IProperty {
    _id: string;
    name: string;
    description: string;
    pricePerMonth: number;
    securityDeposit: number;
    applicationFee: number;
    amenities: AmenityEnum[];
    highlights: HighlightEnum[];
    beds: number;
    baths: number;
    squareFeet: number;
    propertyType: PropertyTypeEnum;
    isPetsAllowed: boolean;
    postedDate: Date;
    isParkingIncluded: boolean;
    photoUrls: string[];
    averageRating: number;
    numberOfReviews: number;
    managerCognitoId: string;
    manager: string;
    location: ILocation;
    applications: string[];
    leases: string[];
    favoritedBy: string[];
    tenants: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  export enum ApplicationStatus {
    Pending = "Pending",
    Denied = "Denied",
    Approved = "Approved",
  }

  export interface IApplication {
    applicationDate: string;
    status: ApplicationStatus;
    propertyId: string;
    tenantCognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
    message?: string;
  }
  export interface UpdateIApplication {
    _id: string;
    applicationDate?: string;
    status?: ApplicationStatus;
    propertyId?: string;
    tenantCognitoId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
    lease?: string;
    tenant?: string;
  }

  export interface ILease {
    startDate: Date;
    endDate: Date;
    rent: number;
    deposit: number;
    tenantCognitoId: string;
    tenant: string;
    property: string;
    application?: string;
    payments: string[];
    nextPaymentDate?: Date;
    _id: string;
  }

  export enum PaymentStatus {
    Pending = "Pending",
    Paid = "Paid",
    PartiallyPaid = "PartiallyPaid",
    Overdue = "Overdue",
  }

  export interface IPayment {
    _id: string;
    amountDue: number;
    amountPaid: number;
    dueDate: Date;
    paymentDate: Date;
    paymentStatus: PaymentStatus;
    lease: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export {};
