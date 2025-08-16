import { Types } from "mongoose";

// Helper: conversie listă string -> ObjectId[]
const toObjectIdList = (ids: string[]): Types.ObjectId[] =>
  ids
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (Types.ObjectId.isValid(s) ? new Types.ObjectId(s) : null))
    .filter((v): v is Types.ObjectId => v !== null);

export default toObjectIdList;
