export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational = true;

	constructor(statusCode: number, message: string) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}
