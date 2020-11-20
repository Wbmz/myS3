import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../helpers';
import { User } from './../entities/User.entity';

class UserController {
    static async save(req: Request, res: Response): Promise<Response> {
        // send confirmation email to user
        const userKeys: string[] = ['nickname', 'email', 'password'];
        const missingValues = userKeys.filter(key => !(key in req.body));
        if (missingValues.length === 0) {
            const { nickname, email, password }: User = req.body;
            let user: User = new User();
            user.nickname = nickname;
            user.email = email;
            user.password = password;
            try {
                user = await User.save(user);
                const token = jwt.sign({ email: user.email, date: new Date() }, config.jwtSecret);
                return res.status(200).send({
                    token,
                    data: user,
                });
            } catch (error) {
                console.log(error);
                return res.status(409).send('Email already used');
            }
        }
        return res.status(400).send(`${missingValues.join(', ')} are missing`);
    }

    static async getOneById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const user = await User.findOneOrFail(id);
            return res.status(200).send({ data: user });
        } catch (error) {
            return res.status(404).send('User not found');
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const data = req.body;
        try {
            await User.update(id, data);
            return res.status(200).send(`User successfully updated`);
        } catch (error) {
            console.log(error);
            return res.status(404).send('User not found');
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            await User.delete(id);
            return res.status(200).send('User successfully deleted');
        } catch (error) {
            return res.status(404).send('User not found');
        }
    }
}

export default UserController;
