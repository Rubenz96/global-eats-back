import { Router } from 'express';
const routerUser = Router();

//AUTH
import * as auth from './auth';
routerUser.post('/login', auth.login);
routerUser.post('/logout', auth.logout);
routerUser.post('/recovery', auth.recovery);
routerUser.post('/password', auth.password); 

export default routerUser;