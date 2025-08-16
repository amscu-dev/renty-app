import { NextFunction, Request, Response } from "express";

export default function catchAsync<TReq extends Request>(
  fn: (req: TReq, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("HIT catchAsync ⏩");
    fn(req as TReq, res, next).catch((err: unknown) => next(err));
  };
}
