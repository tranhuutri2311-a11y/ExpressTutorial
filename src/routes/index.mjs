import { Router } from "express";
import { userRouter } from "./user.mjs";
import { productRouter } from "./product.mjs";
import { authRouter } from "./auth.mjs";
import { cartRouter } from "./cart.mjs";

const router = Router();

router.use(userRouter);
router.use(productRouter);
router.use(authRouter);
router.use(cartRouter);

export {router as allRoutes};