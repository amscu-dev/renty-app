import { ValidationError } from "express-validator";

const formatValidationErrors = (results: ValidationError[]) => {
  let formattedError: any = {};
  for (const error of results) {
    if (error.type === "field") {
      if (!formattedError[error.path]) {
        formattedError[error.path] = {
          errorMessages: [error.msg],
        };
      } else {
        formattedError[error.path].errorMessages.push(error.msg);
      }
    }
  }
  return formattedError;
};

export default formatValidationErrors;
