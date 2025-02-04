import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { __dirname } from "./path.configuration.js";

// * instancing express
const app = express();

// * configuring and calling dependencies for request handling
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser(process.env.SECRET));

app.use(morgan('dev'));

app.use(cors());

// * Define access for web files
app.use('/public', express.static(path.join(__dirname, 'resources', 'public')));
app.use('/public', express.static(path.join(__dirname, 'resources', 'private')));


// * defining  not found route / default route
app.use((req, res) => {
    res.json("Hello worl")
});

export default app;