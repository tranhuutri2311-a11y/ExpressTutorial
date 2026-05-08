import express from "express";
import { allRoutes } from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./strategies/discord-strategies.mjs"

const app   = express();

mongoose.connect("mongodb://localhost:27017/testing").then(()=> console.log("Connected to MongoDB"))

app.use(cookieParser("mmmmmmmmmmmmmmmm"));
app.use(express.json());
app.use(session({
    secret : "amuzakkk",
    saveUninitialized : false,
    resave : false,
    cookie : {maxAge : 600000},
    // Session Store in MongoDB
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
app.get("/api/auth/discord",passport.authenticate("discord"));
app.get("/api/auth/discord/redirect",passport.authenticate("discord"),(req,res)=>{
    console.log(req.user);
    res.status(200).send(req.user);
})
app.listen(port, () => {

    console.log(`Server is running on port ${port}`);
});

