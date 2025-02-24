const express = require('express');
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require('cors');
const path = require('path');

// Import routes
const user = require("./routes/user");
const book = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const order = require("./routes/order");
const event = require("./routes/event");

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);
app.use("/api/v1", event);

// Create the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
