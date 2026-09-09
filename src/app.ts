import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import notFound from "./app/middleware/not-found";
import globalError from "./app/middleware/global-error";

import config from "./app/config";

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



// error handle
app.use(notFound);
app.use(globalError);


export default app;
