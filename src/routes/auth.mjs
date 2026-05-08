import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.status(200).send({ msg: "Login successful", user: req.user });
});


router.get("/api/auth/status",(req,res)=>{
    return req.user ? res.send(req.user) : res.status(401).send("Bad Request, No session found");
})

router.post("/api/logout", (req, res) => {
    if (!req.user) return res.status(400).send("Not logged in");
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send("Logout successfully");
    });
})

export { router as authRouter };
