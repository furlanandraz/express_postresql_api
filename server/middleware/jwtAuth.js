import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

secret = process.env.JWT_SECRET;

export default function adminAuth(err, req, res, next) {
    
    if (req.method === 'OPTIONS') return next();

    
}
