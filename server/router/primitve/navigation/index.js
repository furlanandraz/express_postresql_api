import express from 'express';
const router = express.Router();

import route from './route/index.js';

router.use('/route', route);

export default router;