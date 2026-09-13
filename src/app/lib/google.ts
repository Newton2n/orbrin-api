import { OAuth2Client, TokenPayload } from "google-auth-library";
import config from "../config";

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
    throw new Error("Invalid Google token");
  }
};
