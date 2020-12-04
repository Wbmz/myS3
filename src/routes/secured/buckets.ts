import { Router } from 'express';
import multer from 'multer';
import BlobController from '../../controllers/BlobController';
import BucketController from '../../controllers/BucketController';

const routes = Router();
const upload = multer();

routes.put('/:id', BucketController.update);
routes.delete('/:id', BucketController.delete);
routes.head('/:id', BucketController.exist);
routes.get('/:bucket_id/blobs', BlobController.getByBucket);
routes.post('/:bucket_id/blobs', upload.single('blob'), BlobController.save);

export default routes;
