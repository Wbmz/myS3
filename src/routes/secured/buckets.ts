import { Router } from 'express';
import BlobController from '../../controllers/BlobController';
import BucketController from '../../controllers/BucketController';

const routes = Router();

routes.post('/', BucketController.save);
routes.put('/:id', BucketController.update);
routes.delete('/:id', BucketController.delete);
routes.head('/:id', BucketController.exist);
routes.get('/:id/blobs', BlobController.getByBucket);

export default routes;
