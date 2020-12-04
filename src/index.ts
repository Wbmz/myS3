import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import routes from './routes';
import { MYS3_PATH } from './data/constants';
import { createFolder } from './helpers/utils';
import './middlewares/passport';

dotenv.config();

const PORT = process.env.PORT || 3000;
//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        const app = express();

        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(passport.initialize());
        app.use('/', routes);
        createFolder(MYS3_PATH);
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}!`);
        });
    })
    .catch(error => console.log(error));
