const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "sst", (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token expired or invalid. Please sign in again." });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
