import { Request, Response } from 'express';
import fs from 'fs';
import { Blob } from '../entities/Blob.entity';
import { deleteFile, getPath } from '../helpers';
import { Bucket } from './../entities/Bucket.entity';

class BlobController {
    static async getByBucket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const blobs = await Blob.find({ where: { bucket: { id } } });
        return res.status(200).send({ data: blobs });
    }

    static async save(req: Request, res: Response): Promise<Response> {
        const fields: string[] = ['bucketId', 'userId'];
        const missingValues = fields.filter(key => !(key in req.body));
        if (req.file && missingValues.length === 0) {
            const { originalname, mimetype, buffer, size } = req.file;
            const { bucketId, userId } = req.body;
            let bucket: Bucket;
            try {
                bucket = await Bucket.findOneOrFail({
                    where: { id: bucketId, user: { id: userId } },
                    relations: ['user'],
                });
            } catch (error) {
                return res.status(404).send('Bucket or user not found');
            }
            const { user } = bucket;
            try {
                await Blob.findOneOrFail({ where: { name: originalname, bucket } });
                return res.status(409).send(`${originalname} already created for ${user.nickname}`);
            } catch (error) {}

            try {
                const blob: Blob = new Blob();
                const filepath = getPath(user.id, bucket.name, originalname);
                blob.name = originalname;
                blob.mimetype = mimetype;
                blob.size = size;
                blob.bucket = bucket;
                blob.path = filepath;
                await Blob.save(blob);
                fs.writeFileSync(filepath, buffer);
                return res.status(200).send('Successfully added the blob');
            } catch (error) {
                return res.status(500).send();
            }
        }

        return res.status(400).send(`${missingValues.join(', ')} are missing`);
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const blob = await Blob.findOneOrFail({
                where: { id },
            });
            await Blob.delete(id);
            deleteFile(blob.path);
            return res.status(200).send('Blob successfully deleted');
        } catch (error) {
            return res.status(404).send('Blob not found');
        }
    }
}

export default BlobController;
