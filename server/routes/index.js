import express from 'express';
const routes = express.Router();

import navigation from './navigation/index.js';
import presentation from './presentation/index.js';
import client from './client/index.js';
import upload from './upload/index.js';
import admin from './admin/index.js'

routes.use(`/navigation`, navigation);
routes.use('/presentation', presentation);
routes.use('/client', client);
routes.use('/upload', upload);
routes.use('/admin', admin)

export default routes;
