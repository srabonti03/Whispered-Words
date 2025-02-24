const router = require("express").Router();
const User = require("../models/user");
const mongoose = require('mongoose');
const { authenticateToken } = require("./userAuth");

// Add book to cart
router.put("/addbooktocart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const { id } = req.user;

        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userData.cart.includes(bookid)) {
            return res.status(400).json({ message: "Book is already in cart" });
        }

        userData.cart.push(bookid);
        await userData.save();

        res.status(200).json({
            message: "Book added to cart successfully",
            cart: userData.cart,
        });
    } catch (error) {
        console.error("Add book to cart error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove book from cart
router.put("/removebookfromcart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const { id } = req.user;

        console.log("Received bookid:", bookid);
        console.log("User ID:", id);

        const userData = await User.findById(id);
        if (!userData) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found" });
        }

        const bookIdObject = new mongoose.Types.ObjectId(bookid);
        if (!userData.cart.some((cartBookId) => cartBookId.equals(bookIdObject))) {
            console.log("Book not in cart.");
            return res.status(400).json({ message: "Book not in cart" });
        }

        userData.cart = userData.cart.filter((cartBookId) => !cartBookId.equals(bookIdObject));
        await userData.save();

        const updatedCart = await User.findById(id).populate("cart");
        res.status(200).json({
            message: "Book removed from cart successfully",
            cart: updatedCart.cart,
        });
    } catch (error) {
        console.error("Remove book from cart error:", error); // Log the full error
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Show all books in the user cart
router.get("/getusercart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const userData = await User.findById(id).populate("cart");

        return res.json({
            message: "User cart fetched successfully",
            cart: userData.cart.reverse(),
        });
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
