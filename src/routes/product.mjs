import { Router } from "express";

const router = Router();

router.get("/api/products", (req,res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if(req.signedCookies.avc && req.signedCookies.avc === "abc"){
        res.send(`Product page with avc cookie ${req.signedCookies.avc}`);
    }
    else{
        res
        .status(403)
        .send({code : 403, message : "This is products page without avc cookie"});
    }
})

export {router as productRouter};