import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

interface IUploadBufferOptions {
  folder: string;
  resourceType?: "image" | "raw" | "video" | "auto";
  publicId?: string;
  format?: string;
}

interface IUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes?: number;
}

const uploadBuffer = async (
  buffer: Buffer,
  options: IUploadBufferOptions,
): Promise<IUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType ?? "image",

        ...(options.publicId && {
          public_id: options.publicId,
        }),

        ...(options.format && {
          format: options.format,
        }),
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed."));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

const deleteAsset = async (
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image",
) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
};

export const cloudinaryService = {
  uploadBuffer,
  deleteAsset,
};