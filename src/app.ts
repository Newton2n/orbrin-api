import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import notFound from "./app/middleware/not-found";
import globalError from "./app/middleware/global-error";

import config from "./app/config";
import { authRoutes } from "./app/module/auth/auth.route";

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



// error handle
app.use(notFound);
app.use(globalError);


export default app;
