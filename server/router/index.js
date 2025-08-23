import express from 'express';

// primitive
import navigation from './primitve/navigation/index.js';
import presentation from './primitve/presentation/index.js';
import client from './primitve/client/index.js';
import auth from './primitve/auth/index.js';
import settings from './primitve/settings/index.js';

// resources
import routeItem from './resource/route-item/index.js';
import routeTree from './resource/route-tree/index.js';

//adapter
import build from './build/index.js';

// upload
import upload from './upload/index.js';

//router
const router = express.Router();

// primitive
router.use('/navigation', navigation);
router.use('/presentation', presentation);
router.use('/client', client);
router.use('/settings', settings)

// auth
router.use('/auth', auth);

//resources
router.use('/resource/route-item', routeItem);
router.use('/resource/route-tree', routeTree);

//adapter
router.use('/adapter/build', build);

// upload
router.use('/upload', upload);

export default router;
