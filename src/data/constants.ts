import path from 'path';
const MYS3_FOLDER = 'myS3DATA';
const MYS3_PATH =
    process.env.NODE_ENV === 'production'
        ? path.join(path.dirname(__dirname), MYS3_FOLDER)
        : MYS3_FOLDER;

export { MYS3_FOLDER, MYS3_PATH };
