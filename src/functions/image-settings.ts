import path from 'path';
import fs from 'fs';
import { ImageSetting } from '../models';

const _getModelFolder = (model: string, publicDir: string): string => {
    const baseUploadsPath = path.join(publicDir, 'uploads');
    const modelFolder = path.join(baseUploadsPath, model);
    if (!fs.existsSync(baseUploadsPath)) {
        fs.mkdirSync(baseUploadsPath);
    }

    if (!fs.existsSync(modelFolder)) {
        fs.mkdirSync(modelFolder);
    }
    return modelFolder;
}  

export const aspectRatioArray = (aspectRatio: string) : number[] => {
    const array = aspectRatio != undefined ? aspectRatio.split(':').map(e => { return parseInt(e); }) : [];
    return array;
}

export const createOriginalFolder = (model: string, publicDir: string) => {
    if (model != undefined) {
        const modelFolder = _getModelFolder(model, publicDir);
        const originalFolder = path.join(modelFolder, 'original');
        if (!fs.existsSync(originalFolder)) {
            fs.mkdirSync(originalFolder);
        }
        return originalFolder;
    } else {
        return '';
    }
}

export const createCroppedFolder = (model: string, publicDir: string) => {
    if (model) {
        const modelFolder = _getModelFolder(model, publicDir);
        const croppedFolder = path.join(modelFolder, 'cropped');
        if (!fs.existsSync(croppedFolder)) {
            fs.mkdirSync(croppedFolder);
        }
        return croppedFolder;
    } else {
        return '';
    }
}

export const createThumbnailFolder = (model: string, publicDir: string) => {
    if (model) {
        const modelFolder = _getModelFolder(model, publicDir);
        const thumbnailFolder = path.join(modelFolder, 'thumbnail');
        if (!fs.existsSync(thumbnailFolder)) {
            fs.mkdirSync(thumbnailFolder);
        }
        return thumbnailFolder;
    } else {
        return '';
    }
}

export const getImageSettingFromDb = async (id: string) => {
    return await ImageSetting
        .findOne({ _id: id })
        .populate({ path: 'createdBy', select: 'fullName' });
}

export const sanitizeImageUpdateData = (body: any) => {
    let aspectRatio = undefined;
    if (body.aspectRatio) {
        aspectRatio = aspectRatioArray(body.aspectRatio);
    }
    let data = { ...body, aspectRatio };
    if (!aspectRatio) {
        delete data.aspectRatio;
    }
    return data;
}