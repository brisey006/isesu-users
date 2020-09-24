import e, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { ProfileForm } from '../forms';
import { systemError } from '../functions/errors';

import { User, Profile } from '../models';

export const addProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profileForm = new ProfileForm(req.body);
        const profile = new Profile({ ...profileForm.data, user: req.user.id });
            await profile.save();
            res.json(profile);
    } catch (e) {
        if (e.code = 11000) {
            next(systemError('Profile already exists.'));
        } else {
            throw e;
        }
    }
}


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user');
        res.json(profile);
    } catch (e) {
        next(systemError(e.message));
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        let dateOfBirth;
        
        if (body.dateOfBirth) {
            dateOfBirth = moment(body.dateOfBirth, 'DD-MM-YYYY');
        }

        const update = await Profile.updateOne({ user: req.user.id }, { $set: { ...body, dateOfBirth } });
        const profile = await Profile.findOne({ user: req.user.id });
        if (update.nModified) {
            res.status(201);
            res.json(profile);
        } else {
            next(systemError('An error occurred.'));
        }
    } catch (e) {
        console.log(e.message);
        next(systemError(e.message));
    }
}