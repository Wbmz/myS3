import { Request, Response } from 'express';
import { User } from './../entities/User.entity';

class UserController {
    static async getAll(req: Request, res: Response): Promise<Response> {
        const users = await User.find();
        return res.status(200).send({ data: users });
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
