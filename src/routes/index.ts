import { Router } from 'express';
import passport from 'passport';
import secured from './secured';
const routes = Router();
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
