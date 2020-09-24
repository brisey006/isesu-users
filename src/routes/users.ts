import { Router } from 'express';
import { addUser, loginUser, refreshToken, logoutUser, getUser, updateUser, requestVerificationToken, verifyUser, addUserFromDb, getUserById } from '../controllers/users';
import { isAuthenticated } from '../config/auth';

const router = Router();

router.post('/', addUser);
router.post('/add', addUserFromDb);
router.get('/request-verification-token/:id', requestVerificationToken);
router.get('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.delete('/logout', isAuthenticated, logoutUser);
router.get('/current', isAuthenticated, getUser);
router.get('/user/:id', getUserById);
router.put('/update', isAuthenticated, updateUser);

export default router;