const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to favorites
router.put("/addbooktofav", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const { id } = req.user;

        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFav = userData.favourite.includes(bookid);

        if (isBookFav) {
            return res.status(400).json({ message: "Book is already in favorites" });
        }

        userData.favourite.push(bookid);
        await userData.save();

        res.status(200).json({
            message: "Book added to favorites successfully",
            favourites: userData.favourite,
        });
    } catch (error) {
        console.error("Add book to favorites error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove book from favorites
router.put("/removebookfromfav", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const userId = req.user.id;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookInFav = userData.favourite.includes(bookid);
        if (!isBookInFav) {
            return res.status(400).json({ message: "Book not found in favourites" });
        }

        userData.favourite = userData.favourite.filter(
            (favBookId) => favBookId.toString() !== bookid
        );

        await userData.save();

        return res.status(200).json({
            message: "Book removed from favorites",
            favourites: userData.favourite,
        });
    } catch (error) {
        console.error("Error removing book from favorites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Showing all favourite books in the user profile
router.get("/favourites", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;

        const userData = await User.findById(id).populate('favourite');

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            favourites: userData.favourite
        });
    } catch (error) {
        console.error("Fetch favorites error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
