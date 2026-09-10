import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import notFound from "./app/middleware/not-found";
import globalError from "./app/middleware/global-error";

import config from "./app/config";
import { authRoutes } from "./app/module/auth/auth.route";
import { teamRoutes } from "./app/module/team/team.route";
import { projectRoutes } from "./app/module/project/project.route";

const app: Application = express();

//accept all req
const corsOptions = {
  origin: `${config.frontend_url}`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//all route
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);



// error handle
app.use(notFound);
app.use(globalError);


export default app;
