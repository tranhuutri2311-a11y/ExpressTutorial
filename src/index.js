import express from "express";
import { allRoutes } from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategies.mjs"
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app   = express();

mongoose.connect("mongodb://localhost:27017/testing").then(()=> console.log("Connected to MongoDB"))

app.use(cookieParser("mmmmmmmmmmmmmmmm"));
app.use(express.json());
app.use(session({
    secret : "amuzakkk",
    saveUninitialized : false,
    resave : false,
    cookie : {maxAge : 600000},
    store : MongoStore.create({
        client : mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(allRoutes);

const port = process.env.PORT || 3000;

app.get('/',(req,res,next) => {
    console.log("Base Url called");
    next();
}, (req, res) => {
    // console.log(req.session);
    console.log(req.sessionID)
    req.session.visited = true;
    res.cookie("avc", "abc",{maxAge : 6000000,signed : true});
    res.send("Hello World!");
});


app.listen(port, () => {

    console.log(`Server is running on port ${port}`);
});