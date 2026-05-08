import { Router } from "express";
import { body, checkSchema, query, validationResult } from "express-validator";
import * as middleware from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { hashPassword } from "../utils/helper.js";

const router = Router();



router.get("/api/users", 
    query("filter").optional().isString().withMessage("Filter must be a string"),
    query("value").optional().isString().withMessage("Value must be a string"),
    middleware.handleValidationErrors,
    async (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error getting session");
        }
        console.log(sessionData);
    });
    console.log(req.query);
    const{
        query : {filter , value}
    } = req;
    if (!filter && !value) return res.send(await User.find());
    if (filter && value) return res.send(await User.find({[filter] : {$regex : value, $options : "i"}}));
    return res.status(400).send("Both 'filter' and 'value' query params are required");
})

router.post("/api/users",checkSchema(createUserValidationSchema),
    async (req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array());
        }
        
        const {body} = req;
        body.password = await hashPassword(body.password);
        const newUser = new User(body);
        try {
            await newUser.save();
            res.status(201).send(newUser);
        } catch (error) {
            console.log(error);
            res.status(500).send("Error creating user");
        }
    
})
router.get("/api/users/:id", middleware.resolveIndexByUserId, async (req, res) => {
    const {id} = req.params;
    const findUser = await User.findOne({_id : id});
    if(!findUser) return res.status(404).send("User not found");
    return res.status(200).send(findUser);
})

router.put("/api/users/:id", 
    body("username").isString().notEmpty().withMessage("Username is required and must be a string"),
    body("email").isEmail().withMessage("Must be a valid email address"),
    middleware.handleValidationErrors,
    async (req,res)=>{
    const {body,id} = req;
    const updatedUser = await User.findByIdAndUpdate(id, body, {new : true});
    if(!updatedUser) return res.status(404).send("User not found");
    return res.status(200).send(updatedUser);
})


router.patch("/api/users/:id", 
    middleware.resolveIndexByUserId,
    body("username").optional().isString().notEmpty().withMessage("Username must be a string if provided"),
    body("email").optional().isEmail().withMessage("Must be a valid email address if provided"),
    middleware.handleValidationErrors,
    async (req,res)=>{
    const{body,id} = req;
    const findUser = await User.findOne({_id : id});
    if(!findUser) return res.status(404).send("User not found");
    const updatedUser = await User.findByIdAndUpdate(id, body, {new : true});
    if(!updatedUser) return res.status(404).send("User not found");
    return res.status(200).send(updatedUser);
})
router.delete("/api/users/:id",middleware.resolveIndexByUserId ,async (req,res)=>{
    const {id} = req;
    const findUser = await User.findOne({_id : id});
    if(!findUser) return res.status(404).send("User not found");
    const deletedUser = await User.findByIdAndDelete(id);
    if(!deletedUser) return res.status(404).send("User not found");
    return res.status(200).send(deletedUser);
})

export { router as userRouter };
