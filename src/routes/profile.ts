import { Router } from 'express';
import { addProfile, updateProfile, getProfile } from '../controllers/profile';
import { isAuthenticated } from '../config/auth';

const router = Router();

router.post('/', isAuthenticated, addProfile);
router.get('/', isAuthenticated, getProfile);
router.put('/update', isAuthenticated, updateProfile);

export default router;