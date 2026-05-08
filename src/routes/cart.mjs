import { Router } from "express";
import { Cart } from "../mongoose/schemas/cart.mjs";

const router = Router();

router.post("/api/cart", async (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
    const {
        body: { productname, quantity }
    } = req;
    try {
        const findCart = await Cart.findOne({ userId: req.user._id });
        if (findCart) {
            const existingItem = findCart.items.find(item => item.productname === productname);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                findCart.items.push({ productname, quantity });
            }
            await findCart.save();
            return res.status(200).send(findCart);
        } else {
            const newCart = new Cart({
                userId: req.user._id,
                items: [{ productname, quantity }]
            });
            await newCart.save();
            return res.status(201).send(newCart);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error saving cart");
    }
});

router.get("/api/cart", async (req,res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    const findCart = await Cart.findOne({userId : req.user._id});
    if(findCart) {
        return res.status(200).send(findCart.items);
    }
    return res.status(404).send("Cart not found");
})

router.delete("/api/cart", async (req,res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { body: {productname} } = req;
    
    try {
        const findCart = await Cart.findOne({userId : req.user._id});
        if(findCart) {
            findCart.items = findCart.items.filter(item => item.productname !== productname);
            await findCart.save();
            return res.status(200).send(findCart);
        }
        return res.status(404).send("Cart not found");
    } catch (error) {
        return res.status(500).send("Error deleting item");
    }
})

router.delete("/api/cart/:productname", async (req,res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { productname } = req.params;
    
    try {
        const findCart = await Cart.findOne({userId : req.user._id});
        if(findCart) {
            findCart.items = findCart.items.filter(item => item.productname !== productname);
            await findCart.save();
            return res.status(200).send(findCart);
        }
        return res.status(404).send("Cart not found");
    } catch (error) {
        return res.status(500).send("Error deleting item");
    }
})


router.patch("/api/cart", async (req,res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { body: {productname, quantity} } = req;
    
    try {
        const findCart = await Cart.findOne({userId : req.user._id});
        if(findCart) {
            const item = findCart.items.find(item => item.productname === productname);
            if (item) {
                item.quantity = quantity;
                await findCart.save();
                return res.status(200).send(findCart);
            }
            return res.status(404).send("Product not found in cart");
        }
        return res.status(404).send("Cart not found");
    } catch (error) {
        return res.status(500).send("Error updating item");
    }
})

export { router as cartRouter };

