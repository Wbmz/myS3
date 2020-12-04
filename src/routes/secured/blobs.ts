import { Router } from 'express';
import BlobController from '../../controllers/BlobController';

const routes = Router();

routes.get('/:id', BlobController.download);
routes.put('/:id', BlobController.update);
routes.delete('/:id', BlobController.delete);
routes.post('/:id/duplicate', BlobController.duplicate);
routes.get('/:id/metadata', BlobController.metadata);

export default routes;
