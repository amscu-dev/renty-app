import { S3Client } from "@aws-sdk/client-s3";

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY_ID;
const secretKey = process.env.S3_SECRET_KEY_ID;

if (!bucketRegion || !accessKey || !secretKey) {
  throw new Error(
    "Missing S3/AWS env vars: region/accessKeyId/secretAccessKey"
  );
}

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

export default s3;
