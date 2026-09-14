import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";

import notFound from "./app/middleware/not-found";
import globalError from "./app/middleware/global-error";
import config from "./app/config";
import rateLimiter from "./app/middleware/rate-limiter";

import { authRoutes } from "./app/module/auth/auth.route";
import { teamRoutes } from "./app/module/team/team.route";
import { projectRoutes } from "./app/module/project/project.route";
import { taskRoutes } from "./app/module/task/task.route";
import { sprintRoutes } from "./app/module/sprint/spring.route";
import { commentRoutes } from "./app/module/comment/comment.route";
import { subscriptionRoutes } from "./app/module/subscription/subscripton.route";
const app: Application = express();

const corsOptions = {
	origin: config.frontend_url,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Stripe webhook MUST come before express.json()
app.use(
	"/api/v1/subscriptions/webhook",
	express.raw({ type: "application/json" }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter Middleware
app.use("/api/v1", rateLimiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

// Error handling
app.use(notFound);
app.use(globalError);

export default app;
