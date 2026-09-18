import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { AppError } from "../utils/app-error";

const client = new OAuth2Client(config.google_client_id);
export const verifyGoogleToken = async (
	idToken: string,
): Promise<TokenPayload | undefined> => {
	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: config.google_client_id,
		});
		return ticket.getPayload();
	} catch (error) {
		console.error("Error verifying Google token:", error);
		throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Google token");
	}
};
