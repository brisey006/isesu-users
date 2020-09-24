import { Router } from 'express';
import users from './users';
import profile from './profile';

const router = Router();

router.use('/', users);
router.use('/profile', profile);

export default router;