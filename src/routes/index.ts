import { Router } from 'express';
import passport from 'passport';
import secured from './secured';
import auth from './auth';

const routes = Router();
routes.use('/auth', auth);
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
