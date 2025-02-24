const express = require('express');
const multer = require('multer');
const path = require('path');
const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const fs = require('fs');
const { authenticateToken } = require("./userAuth");

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        const bookTitle = req.body.title.replace(/\s+/g, '-').toLowerCase();
        cb(null, bookTitle + '-' + Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Add book - Admin
router.post('/addbook', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const { title, author, price, desc, language, genre } = req.body;
        if (!title || !author || !price || !desc || !language || !genre) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const imageUrl = req.file ? `/public/${req.file.filename}` : '';
        const book = new Book({
            url: imageUrl,
            title,
            author,
            price,
            desc,
            language,
            genre,
        });

        await book.save();
        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update book - Admin
router.put("/updatebook/:id", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price, desc, language, genre } = req.body;
        const imageUrl = req.file ? `/public/${req.file.filename}` : null;

        const bookExists = await Book.findById(id);
        if (!bookExists) {
        return res.status(404).json({ message: "Book not found" });
        }

        if (imageUrl && bookExists.url) {
        const oldImagePath = path.join(__dirname, "..", bookExists.url);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        }

        const updatedBookData = {
        title: title || bookExists.title,
        author: author || bookExists.author,
        price: price || bookExists.price,
        desc: desc || bookExists.desc,
        language: language || bookExists.language,
        genre: genre || bookExists.genre,
        url: imageUrl || bookExists.url,
        };

        const updatedBook = await Book.findByIdAndUpdate(id, updatedBookData, { new: true });

        return res.status(200).json({
        message: "Book updated successfully",
        book: updatedBook,
        });
    } catch (error) {
        console.error("Update book error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete book - Admin
router.delete("/deletebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;

        const user = await User.findById(req.user.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        const bookExists = await Book.findById(bookid);
        if (!bookExists) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (bookExists.url) {
            const imagePath = path.join(__dirname, "..", bookExists.url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Delete book error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all books - Public
router.get("/getallbooks", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.error("Get all books error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get number of books by genre - Public
router.get("/booksbygenre", async (req, res) => {
    try {
        const genreCounts = await Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 },
                },
            },
        ]);

        return res.json({
            status: "success",
            data: genreCounts,
        });
    } catch (error) {
        console.error("Error fetching books by genre:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Recently added 4 books - Public
router.get("/getrecentbooks", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.error("Get recent books error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch book details - Public
router.get("/getbookdetails/:bookid", async (req, res) => {
    try {
        const { bookid } = req.params;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.json({
            status: "success",
            data: book,
        });
    } catch (error) {
        console.error("Get book details error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Mark books as Best Seller (Sold more than 5 times in the last month)
router.get("/markbestsellers", async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const soldBooks = await Order.aggregate([
            { $unwind: "$book" },
            { $match: { placeOrderTimestamp: { $gte: oneMonthAgo } } },
            { $group: { _id: "$book", soldCount: { $sum: 1 } } },
            { $match: { soldCount: { $gt: 5 } } },
        ]);

        const bestSellerBookIds = soldBooks.map((book) => book._id);

        const bestSellerBooks = await Book.find({
            _id: { $in: bestSellerBookIds },
        });

        res.status(200).json({
            message: "Best sellers fetched successfully",
            data: bestSellerBooks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
