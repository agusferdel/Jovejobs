import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'No autorizado' });
  } else {
    let token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No autorizado' });
    } else {
      try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = payload;
        req.user_id = id;
        next();
      } catch (error) {
        res.status(401).json({ message: 'No autorizado' });
      }
    }
  }
};
