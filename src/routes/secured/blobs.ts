import { Router } from 'express';
import multer from 'multer';
import BlobController from '../../controllers/BlobController';

const routes = Router();
const upload = multer();

routes.post('/', upload.single('blob'), BlobController.save);
routes.get('/:id', BlobController.download);
routes.put('/:id', BlobController.edit);
routes.delete('/:id', BlobController.delete);
routes.post('/:id/duplicate', BlobController.duplicate);
routes.get('/:id/metadata', BlobController.metadata);

export default routes;
