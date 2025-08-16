import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

async function uploadAllOrRollback(
  files: Express.Multer.File[],
  s3: S3Client,
  bucketName: string
) {
  const uploadedKeys: string[] = [];
  const photoUrls: string[] = [];

  try {
    for (const file of files) {
      const imageName = `${Date.now()}--${uuidv4()}`;
      const Key = `properties/${imageName}`;
      const uploadResult = await new Upload({
        client: s3,
        params: {
          Bucket: bucketName,
          Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
        partSize: 8 * 1024 * 1024,
        queueSize: 4,
        leavePartsOnError: false,
      }).done();

      uploadedKeys.push(Key);
      photoUrls.push(uploadResult.Location!);
    }

    return photoUrls;
  } catch (err) {
    // rollback ce a reușit deja
    if (uploadedKeys.length) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: uploadedKeys.map((Key) => ({ Key })) },
        })
      );
    }
    throw err;
  }
}

export default uploadAllOrRollback;
