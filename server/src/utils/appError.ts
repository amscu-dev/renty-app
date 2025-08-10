class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
