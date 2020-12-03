import { Router } from 'express';
import passport from 'passport';
import secured from './secured';
import auth from './auth';
import blobs from './blobs';

const routes = Router();
routes.use('/auth', auth);
routes.use('/blobs', blobs);
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
