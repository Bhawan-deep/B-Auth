import jwt from 'jsonwebtoken';

const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized: Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Unauthorized: Invalid token.' });
  }
};

export default verifyTokenFromCookie;
