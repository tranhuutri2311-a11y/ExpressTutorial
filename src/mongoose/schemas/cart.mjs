import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    items : [
        {
            productname : {type : mongoose.Schema.Types.String, required : true},
            quantity : {type : mongoose.Schema.Types.Number, required : true, default : 1}
        }
    ]
})

const Cart = mongoose.model("Cart", cartSchema);
export {Cart};