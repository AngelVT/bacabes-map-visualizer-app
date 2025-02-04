import app from "./app.js";

// * getting the port for the app to run
const APP_PORT = process.env.MV_APP_PORT;

// * initializing the server on the port
const server = app.listen(APP_PORT, () => {
    console.log("Listening on port: ", APP_PORT);
});