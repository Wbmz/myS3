import { Router } from 'express';
import UserController from '../controllers/UserController';

const routes = Router();

routes.post('/', UserController.save);
routes.get('/:id', UserController.getOneById);
routes.put('/:id', UserController.update);
routes.delete('/:id', UserController.delete);

export default routes;
