import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config, createFolder, getPath } from '../helpers';
import { User } from './../entities/User.entity';
import { sendConfirmationEmail, sendPasswordChanged, sendPasswordReset } from './../emails/index';

//TODO: remove password from the returned user object
type TokenType = {
    id: string;
    email: string;
};

class AuthController {
    static async register(req: Request, res: Response): Promise<Response> {
        const fields: string[] = ['nickname', 'email', 'password'];
        const missingValues = fields.filter(key => !(key in req.body));
        if (missingValues.length === 0) {
            const { nickname, email, password }: User = req.body;
            let user: User = new User();
            user.nickname = nickname;
            user.email = email;
            user.password = password;
            try {
                user = await User.save(user);
                createFolder(getPath(user.id));
                await sendConfirmationEmail(email, { nickname });
                const token = jwt.sign({ email, date: new Date() }, config.jwtSecret);
                return res.status(200).send({
                    token,
                    data: user,
                });
            } catch (error) {
                return res.status(409).send('Email already used');
            }
        }
        return res.status(400).send(`${missingValues.join(', ')} are missing`);
    }

    static async login(req: Request, res: Response): Promise<Response> {
        const fields: string[] = ['email', 'password'];
        const missingValues = fields.filter(key => !(key in req.body));
        if (missingValues.length === 0) {
            const { email, password }: User = req.body;

            try {
                const user = await User.findOneOrFail(
                    { email },
                    { select: ['id', 'email', 'password'] },
                );

                if (!user.isPasswordValid(password)) {
                    return res.status(401).send('Email or password invalid');
                }

                const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);

                return res.send({ token, data: user });
            } catch (error) {
                return res.status(404).send('User not found');
            }
        }
        return res.status(400).send(`${missingValues.join(', ')} are missing`);
    }

    static async resetPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send('Email is required');
        }

        let user: User;
        try {
            user = await User.findOneOrFail({
                email,
            });
        } catch (error) {
            return res.status(404).send('User not found');
        }

        try {
            const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
                expiresIn: '10m',
            });
            await sendPasswordReset(email, {
                nickname: user.nickname,
                token,
            });
            return res.status(200).send('Email successfully sent');
        } catch (error) {
            return res.status(500).send();
        }
    }

    static async changePassword(req: Request, res: Response): Promise<Response> {
        const { token } = req.params;
        let id;
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            id = (decoded as TokenType).id;
        } catch (err) {
            return res.status(401).send('Invalid token');
        }

        const fields: string[] = ['oldPassword', 'newPassword'];

        const missingValues: string[] = fields.filter(key => !(key in req.body));
        if (missingValues.length === 0) {
            const { oldPassword, newPassword } = req.body;
            if (!(oldPassword && newPassword)) {
                return res.status(400).send();
            }
            let user: User;
            try {
                user = await User.findOneOrFail(id, {
                    select: ['id', 'nickname', 'email', 'password'],
                });
            } catch (error) {
                return res.status(404).send('User');
            }

            if (!user.isPasswordValid(oldPassword)) {
                return res.status(401).send();
            }

            user.password = newPassword;

            await User.save(user);
            try {
                await sendPasswordChanged(user.email, {
                    nickname: user.nickname,
                });
                return res.status(200).send('Password successfully changed');
            } catch (error) {
                return res.status(500).send();
            }
        }
        return res.status(400).send(`${missingValues.join(', ')} are missing`);
    }
}

export default AuthController;
