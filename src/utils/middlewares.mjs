import { validationResult } from "express-validator";
import { mockUsers } from "./constants.mjs";

export const handleValidationErrors = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }
    next();
};

export const resolveIndexByUserId = (req,res,next) => {
    const {
        body,
        params : {id}   
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400).send("Bad request, Invalid User id");
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.status(404).send("User not found");
    req.findUserIndex = findUserIndex;
    next();
};
