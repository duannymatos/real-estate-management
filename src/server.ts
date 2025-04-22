import express, { Application, Request, Response } from "express";
import { userRouter } from "./router/userRouter";
import houseRouter from "./router/house-router";
import loggingMiddleware from "./middleware/logging-middleware";
import cors from "cors";
// import { Client } from "pg";
// import { Server } from "http";


const app: Application = express();

const PORT = process.env.PORT || 8082;
console.log(PORT);

app.use(cors());

// // Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', "true");

//     // Pass to next layer of middleware
//     next();
// });

app.use(loggingMiddleware);
app.use(express.urlencoded());
app.use(express.json());

app.use("/users", userRouter);
app.use("/houses", houseRouter);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
});

export default app;

// app.use(
//     session({
//         secret: "mySecret",
//         resave: false,
//         saveUninitialized: false
//     })
// );