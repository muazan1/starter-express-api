const jwt = require("jsonwebtoken");

const IsAuth = (req, res, next) => {

    console.log('In Middleware')

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    try {
        const decoded = jwt.verify(token, 'nmdsb67f9pknp4lmcnb30h27ub53aate');

        req.user = decoded;

    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    return next();
};

module.exports = IsAuth;