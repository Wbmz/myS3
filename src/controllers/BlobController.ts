import { Request, Response } from 'express';
import fs from 'fs';
import { escapeRegExp } from 'lodash';
import path from 'path';
import { Blob } from '../entities/Blob.entity';
import { deleteFile, getPath } from '../helpers';
import { Bucket } from './../entities/Bucket.entity';

class BlobController {
    static async getByBucket(req: Request, res: Response): Promise<Response> {
        const { bucket_id } = req.params;
        const blobs = await Blob.find({ where: { bucket: { id: bucket_id } } });
        return res.status(200).send({ data: blobs });
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const blob = await Blob.findOneOrFail({
                where: { id },
                relations: ['bucket', 'bucket.user'],
            });
            const ext = path.extname(blob.name);
            const { bucket } = blob;
            const { user } = bucket;

            const filepath = getPath(user.id, bucket.name, name + ext);

            fs.renameSync(blob.path, filepath);
            blob.name = name + ext;
            blob.path = filepath;
            await Blob.save(blob);
            return res.status(200).send('Blob successfully renamed');
        } catch (error) {
            return res.status(404).send('Blob not found');
        }
    }

    static async download(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const blob: Blob = await Blob.findOneOrFail({
                where: {
                    id,
                },
            });

            res.download(blob.path);
        } catch (error) {
            res.status(404).send('Blob not found');
        }
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
                relations: ['bucket'],
            });
        } catch (error) {
            return res.status(404).send('Blob not found');
        }

        if (fs.existsSync(blob.path)) {
            const { dir, name, ext } = path.parse(blob.path);
            const regex: RegExp = new RegExp(escapeRegExp(name + `.copy.`) + '([\\d]+)');
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

            try {
                const blobCopy: Blob = new Blob();

                blobCopy.name = newFile;
                blobCopy.mimetype = blob.mimetype;
                blobCopy.size = blob.size;
                blobCopy.bucket = blob.bucket;
                blobCopy.path = path.join(dir, newFile);

                await Blob.save(blobCopy);
                return res.status(200).send(`${name} duplicated into ${newFile}`);
            } catch (error) {
                return res.status(500).send();
            }
        }

        return res.status(404).send(`${blob.name} path not found`);
    }

    static async save(req: Request, res: Response): Promise<Response> {
        if (req.file) {
            const { originalname, mimetype, buffer, size } = req.file;
            const { bucket_id } = req.params;
            let bucket: Bucket;
            try {
                bucket = await Bucket.findOneOrFail({
                    where: { id: bucket_id },
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
                let blob: Blob = new Blob();
                const filepath = getPath(user.id, bucket.name, originalname);
                blob.name = originalname;
                blob.mimetype = mimetype;
                blob.size = size;
                blob.bucket = bucket;
                blob.path = filepath;
                blob = await Blob.save(blob);
                fs.writeFileSync(filepath, buffer);
                return res.status(200).send({ data: blob });
            } catch (error) {
                return res.status(500).send();
            }
        }

        return res.status(400).send('File is missing');
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
