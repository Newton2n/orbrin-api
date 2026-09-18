import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	database_url: process.env.DATABASE_URL,
	node_env: process.env.NODE_ENV,
	port: process.env.PORT || 5000,
	app_url: process.env.APP_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,
	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
	stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
	stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
	admin_password: process.env.ADMIN_PASSWORD!,
	frontend_url: process.env.FRONTEND_URL!,
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	upstash_redis_rest_url: process.env.UPSTASH_REDIS_REST_URL,
	upstash_redis_rest_token: process.env.UPSTASH_REDIS_REST_TOKEN,
	orbrin_base_one_month_plan_id: process.env.ORBRIN_BASE_ONE_MONTH_PLAN_ID,
	demo_email: process.env.DEMO_EMAIL,
	demo_slug: process.env.DEMO_SLUG,
	demo_password: process.env.DEMO_PASSWORD,
	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	smtp_email_sender: process.env.SMTP_EMAIL_SENDER!,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};
