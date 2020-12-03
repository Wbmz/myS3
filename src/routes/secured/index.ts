import { Router } from 'express';
import users from './users';
import buckets from './buckets';
import blobs from './blobs';

const routes = Router();

routes.use('/users', users);
routes.use('/buckets', buckets);
routes.use('/blobs', blobs);

export default routes;
