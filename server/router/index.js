import express from 'express';
const router = express.Router();
// primitive
import navigation from './primitve/navigation/index.js';
import presentation from './primitve/presentation/index.js';
import client from './primitve/client/index.js';
import auth from './primitve/auth/index.js';

// resources
import routeItem from './resource/route-item/index.js';

// upload
import upload from './upload/index.js';

// primitive
router.use('/navigation', navigation);
router.use('/presentation', presentation);
router.use('/client', client);

router.use('/auth', auth);

//resources
router.use('/resource/route-item', routeItem);

// upload
router.use('/upload', upload);

export default router;
