import { Request, Response } from 'express';
import { User } from '../entities/User.entity';
import { updateFolder, deleteFolder, getPath, createFolder } from '../helpers';
import { Bucket } from './../entities/Bucket.entity';

class BucketController {
    static async save(req: Request, res: Response): Promise<Response> {
        const fields: string[] = ['name'];
        const missingValues = fields.filter(key => !(key in req.body));
        if (missingValues.length === 0) {
            const { user_id } = req.params;
            const { name } = req.body;
            let user: User;
            let bucket: Bucket = new Bucket();
            try {
                user = await User.findOneOrFail(user_id);
            } catch (error) {
                return res.status(404).send('User not found');
            }

            try {
                await Bucket.findOneOrFail({ where: { name, user } });
                return res.status(409).send(`${name} already created for ${user.nickname}`);
            } catch (error) {}

            bucket.name = name;
            bucket.user = user;

            try {
                bucket = await Bucket.save(bucket);
                createFolder(getPath(user.id, name));
                return res.status(200).send({ data: bucket });
            } catch (error) {
                return res.status(500).send(`Couldn't create bucket`);
            }
        }
        return res.status(400).send(`${missingValues.join(', ')} is missing`);
    }

    static async exist(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await Bucket.findOneOrFail(id);
            return res.send('OK');
        } catch (error) {
            return res.status(404).send();
        }
    }

    static async getOneById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const bucket = await Bucket.findOneOrFail(id);
            return res.status(200).send({ data: bucket });
        } catch (error) {
            return res.status(404).send('Bucket not found');
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const { user, ...bucket } = await Bucket.findOneOrFail({
                where: { id },
                relations: ['user'],
            });
            await Bucket.update(id, { name });
            updateFolder(getPath(user.id, bucket.name), getPath(user.id, name));
            return res.status(200).send(`Bucket successfully updated`);
        } catch (error) {
            return res.status(404).send('Bucket not found');
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const { user, ...bucket } = await Bucket.findOneOrFail({
                where: { id },
                relations: ['user'],
            });
            await Bucket.delete(id);
            deleteFolder(getPath(user.id, bucket.name));
            return res.status(200).send('Bucket successfully deleted');
        } catch (error) {
            return res.status(404).send('Bucket not found');
        }
    }
}

export default BucketController;
