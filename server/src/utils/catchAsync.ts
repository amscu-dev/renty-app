import { NextFunction, Request, RequestHandler, Response } from "express";

type fnRequestHandlerSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function catchAsync(fn: fnRequestHandlerSignature) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: unknown) => next(err));
  };
}
