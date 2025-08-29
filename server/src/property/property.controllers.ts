import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import mongoose, { HydratedDocument } from "mongoose";
import { IManager } from "../manager/manager.interface";
import { Manager } from "../manager/manager.schema";
import axios from "axios";
import {
  DEFAULT_RADIUS_FOR_GEOSPATIAL_QUARIES,
  GEO_API_RESPONSE_FORMAT,
  GEO_API_RESPONSE_LIMIT,
  GEO_API_USER_AGENT_HEADER,
} from "../constants";
import AppError from "../utils/appError";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { GEO_API_REPONSE_TYPE, IProperty } from "./property.interface";
import s3 from "../config/s3Bucket.config";
import uploadAllOrRollback from "../utils/uploadToS3Rollback";
import { Location } from "../location/location.schema";
import { Property } from "./property.schema";
import toObjectIdList from "../utils/convertIdToMongooseId";
import { matchedData, validationResult } from "express-validator";
import formatValidationErrors from "../utils/formatValidationErrors";

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) throw new Error("Missing S3/AWS env vars: Bucket Name.");

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}
export const createProperty = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:POST Create Property Route 🛖");
    // EXTRACT VALIDATION DATA
    const results = validationResult(req).array();
    if (results.length > 0) {
      const validationErros = formatValidationErrors(results);
      return next(
        new AppError(JSON.stringify(validationErros), StatusCodes.BAD_REQUEST)
      );
    }
    // 01. Collect Manager Data
    const { id: cognitoId } = req.user;
    // 02. Collect Data from body
    const {
      address,
      city,
      state,
      country,
      postalCode,
      housenumber,
      name,
      description,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      amenities,
      highlights,
      isPetsAllowed,
      isParkingIncluded,
      beds,
      baths,
      squareFeet,
      propertyType,
    } = matchedData(req);
    console.log({
      address,
      city,
      state,
      country,
      postalCode,
      housenumber,
      name,
      description,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      amenities,
      highlights,
      isPetsAllowed,
      isParkingIncluded,
      beds,
      baths,
      squareFeet,
      propertyType,
    });
    if (!address || !city || !country || !postalCode) {
      return next(
        new AppError(
          "Sorry, we couldn't find your location. Please ensure you fill all the address fields with proper information.",
          StatusCodes.NOT_FOUND
        )
      );
    }
    const files = req.files as Express.Multer.File[];
    // 03. Identify Manager in DB
    const manager: HydratedDocument<IManager> | null = await Manager.findOne({
      cognitoId,
    });

    if (!manager) {
      return next(
        new AppError(
          "There is no user with this ID! Please register!",
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    // 04. Call Nomation API: Calculate Lng,Lat
    let geocodingResponse: GEO_API_REPONSE_TYPE;
    try {
      geocodingResponse = await axios.get(`${process.env.GEO_API}`, {
        params: {
          street: address,
          housenumber: housenumber,
          city,
          country,
          ...(state ? { state } : {}),
          postcode: postalCode,
          format: GEO_API_RESPONSE_FORMAT,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          // Timeout
          return next(
            new AppError(
              "Upstream request timed out",
              StatusCodes.GATEWAY_TIMEOUT
            )
          );
        } else if (error.request && !error.response) {
          // No response received / request error
          return next(
            new AppError(
              "Bad Gateway: no response from upstream",
              StatusCodes.BAD_GATEWAY
            )
          );
        } else if (error.response) {
          // Response with status code non-2xx
          return next(
            new AppError(
              getReasonPhrase(error.response.status),
              error.response.status
            )
          );
        } else {
          // Axios Config Error
          return next(
            new AppError(
              "Internal Server Error",
              StatusCodes.INTERNAL_SERVER_ERROR
            )
          );
        }
      } else {
        return next(
          new AppError(
            "Unexpected internal server error",
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      }
    }
    if (geocodingResponse.data.results.length === 0) {
      return next(
        new AppError(
          "Sorry, we couldn't find your location. Please ensure you fill all the address fields with proper information.",
          StatusCodes.NOT_FOUND
        )
      );
    }
    // 05. If all good extract lat, lang from geocodingResponse
    const { lat, lon, formatted } = geocodingResponse.data.results[0];

    // 06. Upload Images to S3 Bucket.
    // 06.01 Costruct Object Command
    const photoUrls = await uploadAllOrRollback(files, s3, bucketName);

    // 07. Create Location Object & Property Object
    let location = new Location({
      address,
      city,
      fullAddress: formatted,
      state,
      country,
      postalCode,
      coordinates: {
        type: "Point",
        coordinates: [Number(lon), Number(lat)],
      },
    });
    let property = new Property({
      name,
      description,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      amenities,
      highlights,
      isPetsAllowed,
      isParkingIncluded,
      beds,
      baths,
      squareFeet,
      propertyType,
      photoUrls,
      managerCognitoId: cognitoId,
      manager: manager._id,
    });

    // Assign Correct ID's
    property.location = location._id;
    location.properties = property._id;

    // Create And Execute Transaction
    const session = await mongoose.startSession();
    try {
      console.log("INTO SESSION 💓");
      // .withTransaction = Convenient Transaction API offers automatic retry for TransientTransactionError, UnknownTransactionCommitResult
      await session.withTransaction(async () => {
        // save doc
        location = await location.save({ session });
        property = await property.save({ session });
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
      console.log("FINISH SESSION ✅");
    }
    // Separate Info
    const plainLocation = location.toObject();
    const { createdAt, updatedAt, __v, ...locationData } = plainLocation;
    const plainProperty = property.toObject();
    const {
      __v: __vProp,
      createdAt: propCreatedAt,
      updatedAt: updatedAtProp,
      ...propertyData
    } = plainProperty;
    const formatedPropData = {
      ...propertyData,
      location: {
        ...locationData,
      },
    };

    res.status(StatusCodes.CREATED).json({
      status: "success",
      statusCode: StatusCodes.CREATED,
      data: formatedPropData,
      meta: {
        createdAt: propCreatedAt,
      },
    });
  }
);

export const getProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const property: HydratedDocument<IProperty> | null =
      await Property.findById(id)
        .select("-__v")
        .populate([
          { path: "location", select: "-__v -createdAt -updatedAt" },
          {
            path: "manager",
            select: "-__v -createdAt -updatedAt -cognitoId",
          },
        ]);
    if (!property)
      return next(
        new AppError(`There is no property with ${id}.`, StatusCodes.NOT_FOUND)
      );

    const plainProperty = property.toObject();

    const { createdAt, updatedAt, __v, ...propertyData } = plainProperty;

    res.status(StatusCodes.CREATED).json({
      status: "success",
      statusCode: StatusCodes.CREATED,
      data: propertyData,
      meta: {
        createdAt: createdAt,
      },
    });
  }
);

export const getProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      latitude,
      longitude,
    } = req.query as {
      favoriteIds?: string; // comma-separated
      priceMin?: string;
      priceMax?: string;
      beds?: string;
      baths?: string;
      propertyType?: string;
      squareFeetMin?: string;
      squareFeetMax?: string;
      amenities?: string; // comma-separated
      latitude?: string;
      longitude?: string;
    };

    // CONSTRUCT $and WITH ALL CONDITIONS
    const and: any[] = [];

    // 01. GEOSPATIAL QUERY FIST
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const radiusKm = DEFAULT_RADIUS_FOR_GEOSPATIAL_QUARIES; // DEFAULT
        const maxDistanceMeters = radiusKm * 1000;

        const locationIds = await Location.find({
          coordinates: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: maxDistanceMeters,
            },
          },
        }).distinct("_id");

        if (locationIds.length === 0) {
          // IF WE DO NOT FIDN ANY LOCATION WITHIN 50KM FROM LAT & LNG PROVIDED RETURN EMPTY DATA
          res.status(StatusCodes.OK).json({
            status: "success",
            statusCode: StatusCodes.OK,
            data: [],
            meta: {
              propertiesNumber: 0,
            },
          });
          return;
        }
        and.push({ location: { $in: locationIds } });
      }
    }

    // 02.PRCE FILTER
    if (priceMin || priceMax) {
      const price: any = {};
      if (priceMin && Number.isFinite(Number(priceMin))) {
        price.$gte = Number(priceMin);
      }
      if (priceMax && Number.isFinite(Number(priceMax))) {
        price.$lte = Number(priceMax);
      }
      if (Object.keys(price).length > 0) {
        and.push({ pricePerMonth: price });
      }
    }

    // 03. Beds / Baths (>=) WITH „any” IGNORED
    if (beds && beds !== "any" && Number.isFinite(Number(beds))) {
      and.push({ beds: { $gte: Number(beds) } });
    }
    if (baths && baths !== "any" && Number.isFinite(Number(baths))) {
      and.push({ baths: { $gte: Number(baths) } });
    }

    // 04. SURFACE
    if (squareFeetMin || squareFeetMax) {
      const sqft: any = {};
      if (squareFeetMin && Number.isFinite(Number(squareFeetMin))) {
        sqft.$gte = Number(squareFeetMin);
      }
      if (squareFeetMax && Number.isFinite(Number(squareFeetMax))) {
        sqft.$lte = Number(squareFeetMax);
      }
      if (Object.keys(sqft).length > 0) {
        and.push({ squareFeet: sqft });
      }
    }

    // 05. PROPERTY TYPE
    if (propertyType && propertyType !== "any") {
      and.push({ propertyType });
    }

    // 06. AMENITIES
    if (amenities && amenities !== "any") {
      const amenityList = amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.toLowerCase())
        .map((s) => `${s.charAt(0).toUpperCase()}${s.substring(1)}`);
      if (amenityList.length > 0) {
        and.push({ amenities: { $all: amenityList } });
      }
    }

    // 07. CHECK FOR FAVORITEIDS
    if (favoriteIds) {
      const fav = toObjectIdList(favoriteIds.split(","));
      if (fav.length > 0) {
        and.push({ _id: { $in: fav } });
      }
    }

    // PREPARE QUERY
    const query = and.length > 0 ? { $and: and } : {};

    // GET PROPERTIES + POPULATE LOCATION
    const properties = await Property.find(query)
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "location",
        select: "address city state country postalCode coordinates",
      })
      .lean();

    // SEND RESPONSE BACK TO CLIENT
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      meta: {
        propertiesNumber: properties.length,
      },
      data: properties,
    });
  }
);
