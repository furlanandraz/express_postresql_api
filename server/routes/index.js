import express from 'express';
const routes = express.Router();

import navigation from './navigation/index.js';
import presentation from './presentation/index.js';

routes.use(`/navigation`, navigation);
routes.use('/presentation', presentation)

export default routes;
