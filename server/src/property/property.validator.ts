import { checkSchema } from "express-validator";
import { Amenity, Highlight, PropertyType } from "./property.interface";
const AMENITIES = Object.values(Amenity);
const HIGHLIGHTS = Object.values(Highlight);
const PROPERTY_TYPES = Object.values(PropertyType);

export const createPropertyValidator = checkSchema(
  {
    name: {
      escape: true,
      trim: true,
      isString: {
        errorMessage: "Please provide a name String value.",
      },
      notEmpty: {
        errorMessage:
          "Name is required in order to register your new property.",
      },
      isLength: {
        options: {
          min: 5,
          max: 50,
        },
        errorMessage:
          "Name must contain between 5 and 50 characters. Please provide us a valid name.",
      },
    },
    description: {
      escape: true,
      trim: true,
      isString: {
        errorMessage: "Please provide a name String value.",
      },
      notEmpty: {
        errorMessage:
          "Description is required in order to register your new property.",
      },
      isLength: {
        options: {
          min: 25,
          max: 250,
        },
        errorMessage:
          "Description must contain between 25 and 250 characters. Please provide us a valid name.",
      },
    },
    pricePerMonth: {
      notEmpty: {
        errorMessage:
          "Price per month is required in order to register your new property.",
      },
      // Only 100.12 its considerem a valid float, not 100,12
      customSanitizer: {
        options: (v) => (typeof v === "string" ? v.replace(/,/g, ".") : v),
      },
      // isFloat verify if a string/number its a valid float
      isFloat: {
        options: { gt: 0 },
        errorMessage:
          "Price per month must be a positive number. Please provide a valid number.",
      },
      // transform string to number, if its string
      // Order Matters! Convert to NUMBER , before check if its valid.
      toFloat: true,
      custom: {
        options: (v) => Number.isFinite(v),
        errorMessage: "Please provide a valid finit number.",
      },
    },
    securityDeposit: {
      notEmpty: {
        errorMessage:
          "Security deposit is required in order to register your new property.",
      },
      customSanitizer: {
        options: (v) => (typeof v === "string" ? v.replace(/,/g, ".") : v),
      },
      isFloat: {
        options: { gt: 0 },
        errorMessage:
          "Security deposit must be a positive number. Please provide a valid number.",
      },
      toFloat: true,
      custom: {
        options: (v) => Number.isFinite(v),
        errorMessage: "Please provide a valid finit number.",
      },
    },
    applicationFee: {
      notEmpty: {
        errorMessage:
          "Applicaiton fee is required in order to register your new property.",
      },
      customSanitizer: {
        options: (v) => (typeof v === "string" ? v.replace(/,/g, ".") : v),
      },
      isFloat: {
        options: { gt: 0 },
        errorMessage:
          "Application fee must be a positive number. Please provide a valid number.",
      },
      toFloat: true,
      custom: {
        options: (v) => Number.isFinite(v),
        errorMessage: "Please provide a valid finit number.",
      },
    },
    amenities: {
      optional: {
        options: {
          // Allow falsy values to be treated as optional
          values: "falsy",
        },
      },
      isArray: {
        errorMessage:
          "Please provide a valid value. Amenties must be an Array.",
      },
      customSanitizer: {
        options: (arr) => Array.from(new Set(arr)),
      },
    },
    // ARRAY ELEMENT VALIDATION
    "amenities.*": {
      trim: true,

      customSanitizer: {
        options: (v) => {
          if (typeof v !== "string") return v;
          const hit = AMENITIES.find(
            (a) => a.toLowerCase() === v.toLowerCase()
          );
          return hit ?? v;
        },
      },

      isIn: {
        options: [AMENITIES],
        errorMessage: `Please provided only allowed values. Allowed: ${AMENITIES.join(
          ", "
        )}`,
      },
    },
    highlights: {
      optional: {
        options: {
          // Allow falsy values to be treated as optional
          values: "falsy",
        },
      },
      isArray: {
        errorMessage:
          "Please provide a valid value. Amenties must be an Array.",
      },
      customSanitizer: {
        options: (arr) => Array.from(new Set(arr)),
      },
    },
    // ARRAY ELEMENT VALIDATION
    "highlights.*": {
      trim: true,

      customSanitizer: {
        options: (v) => {
          if (typeof v !== "string") return v;
          const hit = HIGHLIGHTS.find(
            (a) => a.toLowerCase() === v.toLowerCase()
          );
          return hit ?? v;
        },
      },

      isIn: {
        options: [HIGHLIGHTS],
        errorMessage: `Please provided only allowed values. Allowed: ${HIGHLIGHTS.join(
          ", "
        )}`,
      },
    },
    isPetsAllowed: {
      optional: { options: { checkFalsy: true, nullable: true } },
      isBoolean: {
        errorMessage: "Please provide a valid boolean value. (true/false).",
      },
      toBoolean: true,
    },
    isParkingIncluded: {
      optional: { options: { checkFalsy: true, nullable: true } },
      isBoolean: {
        errorMessage: "Please provide a valid boolean value. (true/false).",
      },
      toBoolean: true,
    },
    beds: {
      notEmpty: {
        errorMessage:
          "Number of beds is required in order to register your new property.",
      },
      // BEFORE TRANSFORM IT IN A VALID INTEGER
      toInt: true,
      isInt: {
        options: { min: 0 },
        errorMessage: "Number of beds must be a valid positive number.",
      },
    },
    baths: {
      notEmpty: {
        errorMessage:
          "Number of baths is required in order to register your new property.",
      },
      // BEFORE TRANSFORM IT IN A VALID INTEGER
      toInt: true,
      isInt: {
        options: { min: 0 },
        errorMessage: "Number of baths must be a valid positive number.",
      },
    },
    squareFeet: {
      notEmpty: {
        errorMessage:
          "Square feet is required in order to register your new property.",
      },
      customSanitizer: {
        options: (v) => (typeof v === "string" ? v.replace(/,/g, ".") : v),
      },
      isFloat: {
        options: { gt: 0 },
        errorMessage:
          "Square feet must be a positive number. Please provide a valid number.",
      },
      toFloat: true,
      custom: {
        options: (v) => Number.isFinite(v),
        errorMessage: "Please provide a valid finit number.",
      },
    },
    propertyType: {
      notEmpty: {
        errorMessage:
          "Property Type is required in order to register you new property,",
      },
      isString: { errorMessage: "Please provide a valid String value." },
      trim: true,

      customSanitizer: {
        options: (v) => {
          if (typeof v !== "string") return v;
          const hit = PROPERTY_TYPES.find(
            (t) => t.toLowerCase() === v.toLowerCase()
          );
          return hit ?? v;
        },
      },

      isIn: {
        options: [PROPERTY_TYPES],
        errorMessage: `Invalid value provided. Allowed: ${PROPERTY_TYPES.join(
          ", "
        )}`,
      },
    },
    address: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "A property must have a valid address." },
      isString: { errorMessage: "Address must be a string." },
      isLength: {
        options: { max: 100 },
        errorMessage: "Property address cannot have more than 100 characters.",
      },
    },
    city: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "A property must have a valid city." },
      isString: { errorMessage: "City must be a string." },
      isLength: {
        options: { max: 40 },
        errorMessage: "Property city cannot have more than 40 characters.",
      },
    },
    housenumber: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "A property must have a valid address number.",
      },
      isString: { errorMessage: "Address number must be a string." },
      isLength: {
        options: { max: 25 },
        errorMessage: "Address number cannot have more than 25 characters.",
      },
    },
    state: {
      optional: true,
      trim: true,
      escape: true,
      isString: { errorMessage: "State must be a string." },
    },
    country: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "A property must have a valid country." },
      isString: { errorMessage: "Country must be a string." },
      isLength: {
        options: { min: 3, max: 45 },
        errorMessage: "Property country must be between 3 and 45 characters.",
      },
    },
    postalCode: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "A property must have a valid postal code." },
      isString: { errorMessage: "Postal code must be a string." },
      isPostalCode: {
        options: "any",
        errorMessage: "Please provide a valid postal code.",
      },
    },
  },
  ["body"]
);
