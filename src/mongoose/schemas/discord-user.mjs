import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema({
    discordId : {type : mongoose.Schema.Types.String, required : true,unique: true},
    username :{type : mongoose.Schema.Types.String, required : true, unique: true},
    email : {type : mongoose.Schema.Types.String, required : true, unique: true},    
})

const DiscordUser = mongoose.model("DiscordUser", discordUserSchema);
export {DiscordUser};