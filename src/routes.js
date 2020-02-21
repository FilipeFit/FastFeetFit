import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import RecipientsController from './app/controllers/RecipientsController';
import RoleController from './app/controllers/RoleController';
import CouriersController from './app/controllers/CouriersController';
import FileController from './app/controllers/FileController';
import OrdersController from './app/controllers/OrdersController';
import OrderProblemController from './app/controllers/OrderProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/auth', AuthController.store);

// From now on only authorized users
routes.use(authMiddleware);
routes.post('/users', UserController.store);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.get('/couriers', CouriersController.index);
routes.post('/couriers', CouriersController.store);
routes.put('/couriers/:id', CouriersController.update);
routes.delete('/couriers/:id', CouriersController.delete);

routes.post('/roles', RoleController.store);

routes.post('/orders', OrdersController.store);
routes.post('/orders/start', OrdersController.start);
routes.post('/orders/deliver', OrdersController.deliver);
routes.post('/orders/:id/problems', OrderProblemController.store);
routes.put('/orders/:id', OrdersController.update);
routes.delete('/orders/:id', OrdersController.delete);
routes.get('/orders/:courierId', OrdersController.indexAllCourierOrders);
routes.get('/orders/:courierId/active', OrdersController.indexActiveByCourier);
routes.get('/orders/:id/problems', OrderProblemController.indexByOrder);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
