import { Router } from 'express';
const router = Router();
import { routeValid, tokenValid, userValid, userPermissionValid, dataValid } from './middleware';

router.use(routeValid, tokenValid, userValid, userPermissionValid, dataValid);

import routerUser from '../user/router';
router.use('/auth', routerUser);

export default router;