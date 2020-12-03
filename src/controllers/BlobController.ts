import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Blob } from '../entities/Blob.entity';
import { deleteFile, getPath } from '../helpers';
import { Bucket } from './../entities/Bucket.entity';

class BlobController {
    static async getByBucket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const blobs = await Blob.find({ where: { bucket: { id } } });
        return res.status(200).send({ data: blobs });
    }

    static async metadata(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const blob: Blob = await Blob.findOneOrFail({
                select: ['path', 'size', 'mimetype'],
                where: {
                    id,
                },
            });
            return res.status(200).send({ data: blob });
        } catch (error) {
            return res.status(404).send('Blob not found');
        }
    }

    static async duplicate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        let blob: Blob;
        try {
            blob = await Blob.findOneOrFail({
                where: { id },
            });
        } catch (error) {
            return res.status(404).send('Blob not found');
        }

        if (fs.existsSync(blob.path)) {
            const { dir, name, ext } = path.parse(blob.path);
            const regex: RegExp = new RegExp(name + `.copy.([\\d]+)`);
            const duplicateFiles: string[] = fs.readdirSync(dir).filter(file => file.match(regex));
            const lastDuplicate: string | undefined = duplicateFiles.sort().pop();
            let newFile = `${name}.copy.1${ext}`;

            if (lastDuplicate) {
                const fileCopy: RegExpMatchArray | null = lastDuplicate.match(regex);
                if (fileCopy) {
                    newFile = `${name}.copy.${Number(fileCopy[1]) + 1}${ext}`;
                    fs.copyFileSync(blob.path, path.join(dir, newFile));
                }
            } else {
                fs.copyFileSync(blob.path, path.join(dir, newFile));
            }
            return res.status(200).send(`${name} duplicated into ${newFile}`);
        }

        return res.status(404).send(`${blob.name} path not found`);
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
