import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helper.js";

export default passport.use(
    new Strategy(async (username,password, done) => {
        try {
            const findUser = await User.findOne({username});
            if(!findUser) return done(null,false,{message : "User not found"});
            if(!comparePassword(password,findUser.password)) 
                return done(null,false,{message : "Wrong Password"});
            return done(null,findUser);
        } catch (error) {
            done(error,null)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) return done(null,false,{message : "User not found"});
        return done(null, findUser);
    } catch (error) {
        return done(error, null);
    }
});