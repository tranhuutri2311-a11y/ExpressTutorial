import { Strategy } from "passport-discord";
import passport from "passport";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.use(
    new Strategy({
        clientID : "1502140611963125820",
        clientSecret : "ylOYqUEJek762OQVcPI74PxOHkqIYalV",
        callbackURL : "http://localhost:3000/api/auth/discord/redirect",
        scope : ["identify", "email"]   
    }, async (accessToken,refreshToken , profile, done ) => {
        console.log(accessToken,refreshToken , profile)
        let finduser;
        try{
            finduser = await DiscordUser.findOne({discordId : profile.id});
        }
        catch(error){
            console.log(error);
            return done(error,null);
        }
        try{
            if(!finduser){
                const newUser = new DiscordUser({
                    discordId : profile.id,
                    username : profile.username,
                    email : profile.email
                });
                await newUser.save();
                return done(null,newUser);
            }
            return done(null,finduser);
        }   
        catch(error){
            console.log(error);
            return done(error,null);
        }
    })
)

passport.serializeUser((user,done) => {
    console.log(user)
    done(null,user.id);
})
passport.deserializeUser(async (id,done) => {
    try{
        const user = await DiscordUser.findById(id);
        done(null,user);
    }
    catch(error){
        done(error,null);
    }
})
// client_secret = ylOYqUEJek762OQVcPI74PxOHkqIYalV
// client_id = 1502140611963125820
// redirect_url = http://localhost:3000/api/auth/discord/redirect