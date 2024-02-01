//const jwt = require("express-jwt");
// const authenticate = jwt({secret: secret});
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
//const config = require("../config/auth.config.js");
verifyToken = (req, res, next) => {
	let token = req.headers["x-access-token"];
	if (!token) { return res.status(403).send({ message: "No token provided, Please try to Login then access will be provided!" }); }
	jwt.verify(token, secret, (err, decoded) => {
		if (err) { return res.status(401).send({ message: "Unauthorized!" }); }
		req.userId = decoded.id;
		next();
	});
};
const authJwt = { verifyToken };
module.exports = authJwt;
