import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const routes = Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/reset-password', AuthController.resetPassword);
routes.post('/change-password/:token', AuthController.changePassword);

export default routes;
