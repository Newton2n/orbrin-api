import type { Response } from "express";
import type { PaginationMeta } from "./query";

interface TSuccessResponse<T> {
	statusCode: number;
	message: string;
	data: T;
	meta?: PaginationMeta;
	pagination?: PaginationMeta;
}

export const sendSuccessResponse = <T>(
	res: Response,
	data: TSuccessResponse<T>,
) => {
	res.status(data.statusCode).json({
		success: true,
		message: data.message,
		data: data.data,
		meta: data?.meta,
		pagination: data?.pagination,
	});
};
