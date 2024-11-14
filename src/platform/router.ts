import { Router } from 'express';
const routerPlatform = Router();

//USER
import * as platform from './services';
routerPlatform.post('/config', platform.pageConfig);

export default routerPlatform;