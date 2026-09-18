import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import config from "../config";

const seedDatabase = async () => {
	try {
		// Check whether the demo user already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: config.demo_email!,
			},
		});

		if (existingUser) {
			console.log("🌱 Demo user already exists. Skipping seed.");
			return;
		}

		const hashedPassword = await bcrypt.hash(
			config.demo_password!,
			Number(config.bcrypt_salt_rounds),
		);

		await prisma.$transaction(async (tx) => {
			// 1. Create demo user
			const user = await tx.user.create({
				data: {
					fullName: "Orbrin Demo Owner",
					email: config.demo_email!,
					passwordHash: hashedPassword,
					emailVerified: true,
				},
			});

			// 2. Create demo organization
			const organization = await tx.organization.create({
				data: {
					name: "Orbrin Demo Organization",
					slug: config.demo_slug!,
				},
			});

			// 3. Make the user the organization admin
			await tx.organizationMembership.create({
				data: {
					userId: user.id,
					organizationId: organization.id,
					role: "ADMIN",
					status: "ACTIVE",
				},
			});

			console.log("Org seeded");
		});
	} catch (error) {
		console.error("Database seed failed:", error);
	}
};

export default seedDatabase;
