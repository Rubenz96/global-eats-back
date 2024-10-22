import { Router } from 'express';
const routerClient = Router();

//USER
import * as product from './services';
routerClient.post('/new', product.newClient);
routerClient.post('/list', product.listClients);
routerClient.post('/delete', product.delClient);

export default routerClient;