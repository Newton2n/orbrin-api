import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

type TErrorDetail = {
  field: string;
  message: string;
};

const globalError = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: TErrorDetail[] = [];

  // Custom App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    errorDetails.push({
      field: "general",
      message: err.message,
    });
  }

  // Prisma Known Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = StatusCodes.CONFLICT;
        message = "Duplicate value found.";

        const field = Array.isArray(err.meta?.target)
          ? err.meta.target.join(", ")
          : String(err.meta?.target);

        errorDetails.push({
          field,
          message: `${field} already exists.`,
        });

        break;
      }

      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "Resource not found.";

        errorDetails.push({
          field: "resource",
          message: "The requested resource does not exist.",
        });
        break;

      case "P2003":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Invalid reference.";

        errorDetails.push({
          field: "relation",
          message: "Referenced record does not exist.",
        });
        break;

      case "P2014":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Relation constraint failed.";

        errorDetails.push({
          field: "relation",
          message: "Operation violates required relation.",
        });
        break;

      default:
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Database request failed.";

        errorDetails.push({
          field: "database",
          message: err.message,
        });
    }
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Database validation failed.";

    errorDetails.push({
      field: "database",
      message: err.message,
    });
  }

  // Prisma Connection Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database connection failed.";

    errorDetails.push({
      field: "database",
      message: err.message,
    });
  }

  // Prisma Engine Crash
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database engine crashed.";

    errorDetails.push({
      field: "database",
      message: "Unexpected database engine error.",
    });
  }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation Error";

    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // JWT Invalid
  else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid access token.";

    errorDetails.push({
      field: "token",
      message: "The provided access token is invalid.",
    });
  }

  // JWT Expired
  else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Access token expired.";

    errorDetails.push({
      field: "token",
      message: "Please login again.",
    });
  }

  // Unknown Error
  else if (err instanceof Error) {
    message = err.message;

    errorDetails.push({
      field: "general",
      message: err.message,
    });
  }

  // Development Log
  if (process.env.NODE_ENV !== "production") {
   
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};

export default globalError;