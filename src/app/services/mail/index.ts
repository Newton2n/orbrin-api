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
    "app",
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

const sendPasswordResetOtpEmail = async ({
  to,
  fullName,
  otp,
}: {
  to: string;
  fullName: string;
  otp: string;
}) => {
  const html = await renderTemplate("reset-password.ejs", {
    fullName,
    otp,
  });

  await sendEmail({
    to,
    subject: "Your Orbrin password reset code",
    html,
  });
};
const sendEmailVerificationOtpEmail = async ({
  to,
  fullName,
  otp,
}: {
  to: string;
  fullName: string;
  otp: string;
}) => {
  const html = await renderTemplate("verify-email.ejs", {
    fullName,
    otp,
  });

  await sendEmail({
    to,
    subject: "Verify your Orbrin email address",
    html,
  });
};
export const mailService = {
  sendEmail,
  sendPasswordResetOtpEmail,
  sendEmailVerificationOtpEmail,
};
