const jwt = require("jsonwebtoken");

const IsAdmin = (req, res, next) => {

    console.log('In Admin Middleware')

    const token =
        req.body.token || req.query.token || req.headers["x-admin-token"];

    if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

    } catch (err) {

        return res.status(401).json({ message: "Invalid Token" });

    }

    return next();

};

module.exports = IsAdmin