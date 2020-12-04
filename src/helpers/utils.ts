import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { MYS3_PATH } from '../data/constants';
moment.locale('fr');

const formatString = (string: string): string => {
    return string.toLowerCase().trim();
};

const dateUtils = {
    currentDate: (formatedDate: string): string => {
        return moment().format(formatedDate);
    },
    formatDate: (date: string, formatedDate: string): string => {
        return moment(new Date(date)).format(formatedDate);
    },
};

const getPath = (...name: string[]): string => {
    return path.join(MYS3_PATH, ...name);
};

const createFolder = (name: string): void => {
    if (!fs.existsSync(name)) {
        fs.mkdirSync(name);
    }
};

const updateFolder = (oldName: string, newName: string): void => {
    if (fs.existsSync(oldName)) {
        fs.renameSync(oldName, newName);
    }
};

const deleteFolder = (name: string): void => {
    if (fs.existsSync(name)) {
        fs.rmdirSync(name, { recursive: true });
    }
};

const deleteFile = (name: string): void => {
    if (fs.existsSync(name)) {
        fs.unlinkSync(name);
    }
};

const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/;
    return re.test(email.toLowerCase());
};

export {
    formatString,
    dateUtils,
    createFolder,
    updateFolder,
    deleteFolder,
    deleteFile,
    getPath,
    validateEmail,
};
