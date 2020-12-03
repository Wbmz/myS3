import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/User.entity';
import { config } from '../helpers';

/**
 * JSON Web Token strategy
 */

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret,
        },
        async (jwtPayload, next) => {
            try {
                const { id } = jwtPayload;
                const user: User | undefined = await User.findOne({ where: { id } });

                if (!user) {
                    next(`User ${id} doesn't exist`);
                    return;
                }

                next(null, user);
            } catch (err) {
                next(err.message);
            }
        },
    ),
);
