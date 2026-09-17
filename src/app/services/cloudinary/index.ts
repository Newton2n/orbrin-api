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
}

const uploadBuffer = async (
	buffer: Buffer,
	options: IUploadBufferOptions,
) => {
	return new Promise<{
		secureUrl: string;
		publicId: string;
		resourceType: string;
		format?: string;
		bytes?: number;
	}>((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: options.folder,
				resource_type: options.resourceType ?? "image",
				...(options.publicId && {
					public_id: options.publicId,
				}),
			},
			(error, result) => {
				if (error) {
					return reject(error);
				}

				if (!result) {
					return reject(
						new Error("Cloudinary upload failed."),
					);
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