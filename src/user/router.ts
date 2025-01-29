import { Router } from 'express';
const routerUser = Router();

//USER
import * as user from './services';
routerUser.post('/permission', user.sidebarConfig);
routerUser.post('/list', user.listUsers);

// routerUser.post('/logout', user.logout);
// routerUser.post('/recovery', user.recovery); 
// routerUser.post('/password', user.password); 

export default routerUser;