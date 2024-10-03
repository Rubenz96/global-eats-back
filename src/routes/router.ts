import { Router } from 'express';
const router = Router();
import { routeValid, tokenValid, userValid, userPermissionValid, dataValid } from './middleware';

router.use(routeValid, tokenValid, userValid, userPermissionValid, dataValid);

import routerAuth from '../auth/router';
router.use('/auth', routerAuth);


import routerUser from '../user/router';
router.use('/user', routerUser);

export default router;