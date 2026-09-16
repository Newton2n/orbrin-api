import ejs from "ejs";
import path from "node:path";
import nodemailer from "nodemailer";

import config from "../../config";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.smtp_user,
		pass: config.smtp_password,
	},
});

const renderTemplate = async (
	templateName: string,
	data: Record<string, unknown>,
) => {
	const templatePath = path.join(
		process.cwd(),
		"src",
		"services",
		"mail",
		"templates",
		templateName,
	);

	return ejs.renderFile(templatePath, data);
};

const sendEmail = async ({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	await transporter.sendMail({
		from: `"Orbrin" <${config.smtp_user}>`,
		to,
		subject,
		html,
	});
};

const sendPasswordResetEmail = async ({
	to,
	fullName,
	resetUrl,
}: {
	to: string;
	fullName: string;
	resetUrl: string;
}) => {
	const html = await renderTemplate("reset-password.ejs", {
		fullName,
		resetUrl,
	});

	await sendEmail({
		to,
		subject: "Reset your Orbrin password",
		html,
	});
};

export const mailService = {
	sendEmail,
	sendPasswordResetEmail,
};