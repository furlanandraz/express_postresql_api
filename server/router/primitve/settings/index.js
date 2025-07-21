import express from 'express';
const router = express.Router();

import language from './language/index.js';

router.use('/language', language);

export default router;