import { Router } from 'express';
import multer from 'multer';
import BlobController from '../../controllers/BlobController';

const routes = Router();
const upload = multer();

routes.post('/', upload.single('blob'), BlobController.save);
routes.post('/duplicate/:id', BlobController.duplicate);
routes.delete('/:id', BlobController.delete);

export default routes;
