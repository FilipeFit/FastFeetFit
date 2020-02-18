import { Router } from 'express';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import RecipientsController from './app/controllers/RecipientsController';
import RoleController from './app/controllers/RoleController';
import CouriersController from './app/controllers/CouriersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/auth', AuthController.store);

// From now on only authorized users
routes.use(authMiddleware);
routes.post('/users', UserController.store);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.get('/couriers', CouriersController.index);
routes.post('/couriers', CouriersController.store);

routes.post('/roles', RoleController.store);

export default routes;
