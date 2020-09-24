import e, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import { UserForm, LoginForm } from '../forms';
import { formError, systemError } from '../functions/errors';

import { User, RefreshToken } from '../models';
import { getToken } from '../functions/users';

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    try {
        const userForm = new UserForm(req.body);
        if (userForm.isValid()) {
            userForm.hashPassword();
            const user = new User(userForm.data);
            await user.save();
            
            const token: string = jwt.sign({
                id: user._id,
                exp: Math.floor(Date.now() / 1000) + (60)
            }, process.env.EMAIL_VERIFICATION_KEY as string);
            const url = `${process.env.BASE_URL}/verify?token=${token}`;
            const msg = {
                to: user.email,
                from: 'digitalhundred263@gmail.com',
                subject: 'Verify your ISESU account.',
                text: 'We are checking if you own this email address.',
                html: `<h3>Click this link to verify your ISESU account<h3><p>${url}`,
            };
            await sgMail.send(msg);

            res.json(user);
        } else {
            next(formError(userForm.errors));
        }
    } catch (e) {
        if (e.code = 11000) {
            next(systemError('User already exists.'));
        } else {
            throw e;
        }
    }
}

export const addUserFromDb = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, _id, created, password } = req.body;
        const user = new User({ firstName, lastName, email, password, isVerified: true, _id, createdAt: created });
        await user.save();
        res.json(user);
    } catch (e) {
        if (e.code = 11000) {
            next(systemError('User already exists.'));
        } else {
            throw e;
        }
    }
}

export const requestVerificationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        if (user.isVerified) {
            next(systemError('User already verified.', 406));
        } else {
            const token: string = jwt.sign({
                id: user._id,
                exp: Math.floor(Date.now() / 1000) + (60)
            }, process.env.EMAIL_VERIFICATION_KEY as string);
            const url = `${process.env.BASE_URL}/verify?token=${token}`;
            const msg = {
                to: user.email,
                from: 'digitalhundred263@gmail.com',
                subject: 'Verify your ISESU account.',
                text: 'We are checking if you own this email address.',
                html: `<h3>Click this link to verify your ISESU account<h3><p>${url}`,
            };
            await sgMail.send(msg);
            res.redirect(`${process.env.FRONT_END_URL as string}/login?verified=A verification link has been successfully sent to ${user.email}`);
        }
    } catch (e) {
        next(systemError(e.message));
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.query.token;
        const userData = jwt.verify(token as string, process.env.EMAIL_VERIFICATION_KEY as string) as any;
        const user = await User.findOne({ _id: userData.id });

        if (user) {
            if (user.isVerified) {
                next(systemError('User already verified.', 406));
            } else {
                const updated = await User.updateOne({ _id: userData.id }, { $set: { isVerified: true } });
                if (updated.nModified) {
                    res.redirect(`${process.env.FRONT_END_URL as string}/login?verified=Your account has been successfully verified. You can now login to continue`);
                } else {
                    next(systemError('An error occurred.'));
                }
            }
        } else {
            next(systemError('User not found', 404));
        }
    } catch (e) {
        next(systemError(e.message));
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginForm = new LoginForm(req.body);
        const errorMsg = systemError('Email or password is incorrect.');
        if (loginForm.isValid()) {
            const isUserAvailable = await User.findOne({ email: loginForm.email });
            if (isUserAvailable) {
                const user = isUserAvailable._doc;
                if (!user) {
                    next(errorMsg);
                } else {
                    let isCorrect: boolean = bcrypt.compareSync(loginForm.password, user.password);
                    if (isCorrect) {

                        const refreshToken: string = jwt.sign({
                            id: user._id,
                            lastLogin: Date.now
                        }, process.env.REFRESH_TOKEN_KEY as string);

                        const refreshTokenDb = new RefreshToken({ token: refreshToken, createdBy: user._id });
                        await refreshTokenDb.save();

                        delete user.password;
                        res.json({ ...user, refreshToken });
                    } else {
                        next(errorMsg);
                    }
                }
            } else {
                next(systemError('User not found', 404));
            }
        } else {
            console.log(loginForm.errors);
            next(formError(loginForm.errors));
        }
    } catch (e) {
        console.log(e.message);
        next(systemError(e.message));
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getToken(req);
        console.log(token);
        const tokenAvailable = await RefreshToken.findOne({ token });

        if (tokenAvailable) {
            const data = jwt.verify(token as string, process.env.REFRESH_TOKEN_KEY as string) as any;

            const user = (await User.findOne({ _id: data.id }))._doc;
            if (!user) {
                next(systemError('User not available in the system.'));
            } else {
                const token: string = jwt.sign({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayImage: user.displayImage,
                    isVerified: user.isVerified,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 48)
                }, process.env.JWT_KEY as string);
                
                res.json({ token });
            }
        } else {
            next(systemError('Invalid token.', 403));
        }
        
    } catch (e) {
        console.log(e.message);
        next(systemError(e.message));
    }
}
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await RefreshToken.deleteOne({ createdBy: req.user.id });
        res.sendStatus(200);
        
    } catch (e) {
        next(systemError(e.message));
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select('-password');
        res.json(user);
    } catch (e) {
        next(systemError(e.message));
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select('-password');
        res.json(user);
    } catch (e) {
        next(systemError(e.message));
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        delete body.password;
        const update = await User.updateOne({ _id: req.user.id }, { $set: body });
        const user = await User.findOne({ _id: req.user.id }).select('-password');
        if (update.nModified) {
            res.status(201);
            res.json(user);
        } else {
            next(systemError('An error occurred.'));
        }
    } catch (e) {
        next(systemError(e.message));
    }
}