import { Router } from 'express';
const routerPermission = Router();

//USER
import * as permission from './services';
// routerPermission.post('/permission',permission.sidebarConfig);
routerPermission.post('/list',permission.listPermissions);
// routerPermission.post('/delete',permission.delProduct);

// routerPermission.post('/logout',permission.logout);
// routerPermission.post('/recovery',permission.recovery); 
// routerPermission.post('/password',permission.password); 

export default routerPermission;