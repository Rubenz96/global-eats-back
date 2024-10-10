import { Router } from 'express';
const routerAuth = Router();

//AUTH
import * as auth from './services';
routerAuth.post('/login', auth.login);
routerAuth.post('/logout', auth.logout);
routerAuth.post('/recovery', auth.recovery);
routerAuth.post('/password', auth.password); 

export default routerAuth; 