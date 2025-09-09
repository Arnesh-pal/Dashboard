const jwt = require('jsonwebtoken');

const requireJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ error: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).send({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains id and email
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = requireJWT;
