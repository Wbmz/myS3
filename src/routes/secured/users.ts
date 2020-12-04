import { Router } from 'express';
import UserController from '../../controllers/UserController';
import BucketController from '../../controllers/BucketController';

const routes = Router();

routes.get('/', UserController.getAll);
routes.get('/:id', UserController.getOneById);
routes.put('/:id', UserController.update);
routes.delete('/:id', UserController.delete);
routes.post('/:user_id/buckets', BucketController.save);

export default routes;
