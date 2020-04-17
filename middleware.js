const jwt = require('jsonwebtoken');

const withAuth = function(req, res, next) {
	const token = req.cookies.token;
	console.log("token: ", token)
	if (!token) {
		res.status(401).send('Unauthorized: No token provided');
	} else {
		jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
			if (err) {
				console.log(err)
				res.status(401).send('Unauthorized token')
			} else {
				req.email = decoded.email;
				next();
			}
		})
	}
}

module.exports = withAuth;