import express from 'express';
const routes = express.Router();

import navigation from './navigation/index.js';

routes.use(`/navigation`, navigation);

export default routes;
