import { Router } from 'express';
import passport from 'passport';
import secured from './secured';
import users from './users';
import auth from './auth';

const routes = Router();
routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
