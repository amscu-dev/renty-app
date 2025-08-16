import { checkSchema } from "express-validator";

export const createTenantValidator = checkSchema(
  {
    cognitoId: {
      // ESCAPE + TRIM CONVERT ANY VALUE TO STRING
      escape: true,
      trim: true,
      // errorMessage Global will overwrite errorMessages for custom validation that didn`t have any custom errormsg between {}
      errorMessage: "ERROR",
      isString: {
        errorMessage: "Please provide a valid String value.",
      },
      notEmpty: {
        errorMessage:
          "Cognito ID is required in order to register your account.",
      },
    },
    name: {
      trim: true,
      escape: true,
      isString: true,
      notEmpty: {
        errorMessage: "Tenant name is required. Please provide us your name.",
        // For this field stop the validation here if fails => it will not include multiple validation errors in validationResult for this field.
        // bail: true,
      },

      isLength: {
        options: {
          min: 4,
          max: 50,
        },
        errorMessage:
          "Name must contain between 4 and 50 characters. Please provide us a valid name.",
      },
    },
    email: {
      trim: true,
      isString: true,
      notEmpty: {
        errorMessage:
          "Email is required in order to register your account. Please provide us a valid email address.",
        // bail: true,
      },
      isEmail: {
        errorMessage: "Please provide us a valid email address.",
      },
    },
    phoneNumber: {
      trim: true,
      isString: true,
      optional: {
        options: {
          // Allow falsy values to be treated as optional
          values: "falsy",
        },
      },
      isMobilePhone: {
        options: "ro-RO",
        errorMessage: "Please provide us a valid phone number.",
      },
    },
  },
  ["body"]
);

export const updateUpdateValidator = checkSchema(
  {
    name: {
      trim: true,
      escape: true,
      isString: true,
      optional: {
        options: {
          values: "falsy",
        },
      },
      isLength: {
        options: {
          min: 4,
          max: 50,
        },
        errorMessage:
          "Name must contain between 4 and 50 characters. Please provide us a valid name.",
      },
    },
    email: {
      trim: true,
      isString: true,
      optional: {
        options: {
          values: "falsy",
        },
      },
      isEmail: {
        errorMessage: "Please provide us a valid email address.",
      },
    },
    phoneNumber: {
      trim: true,
      isString: true,
      optional: {
        options: {
          // Allow falsy values to be treated as optional
          values: "falsy",
        },
      },
      isMobilePhone: {
        options: "ro-RO",
        errorMessage: "Please provide us a valid phone number.",
      },
    },
  },
  ["body"]
);
