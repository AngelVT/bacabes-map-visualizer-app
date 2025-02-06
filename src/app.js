import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { __dirname } from "./path.configuration.js";
import appRoutes from './routes/app.routes.js';
import layerRoutes from './routes/layer.routes.js';

// * instancing express
const app = express();

// * configuring and calling dependencies for request handling
//limiting json content type requests
app.use(express.json({ limit: '5mb' }));
//limiting urlencoded content type requests
app.use(express.urlencoded({ limit: '5mb', extended: true }));

//verify incoming cookies and provide signed cookies
app.use(cookieParser(process.env.MV_SECRET_COOKIES));

//logging request to the console
app.use(morgan('dev'));

//cors configuration
app.use(cors());

// * Define access for web files
app.use('/public', express.static(path.join(__dirname, 'resources', 'public')));
app.use('/private', express.static(path.join(__dirname, 'resources', 'private')));

// * Defining routes

//navigation routes
app.use('/app', appRoutes);

//routes for CRUD with the layers
app.use('/api/layer', layerRoutes);

// * defining  not found route / default route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'resources', 'public', '404.html'))
});

export default app;