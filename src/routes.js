import { Router } from 'express';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import RecipientsController from './app/controllers/RecipientsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/auth', AuthController.store);

// From now on only authorized users
routes.use(authMiddleware);
routes.post('/users', UserController.store);
routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

export default routes;
