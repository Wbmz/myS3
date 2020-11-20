import { Router } from 'express';
import passport from 'passport';
import secured from './secured';
import users from './users';

const routes = Router();
routes.use('/users', users);
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
