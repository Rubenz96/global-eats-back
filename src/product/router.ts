import { Router } from 'express';
const routerProduct = Router();

//USER
import * as product from './services';
routerProduct.post('/new', product.newProduct);
routerProduct.post('/list', product.listProducts);
routerProduct.post('/delete', product.delProduct);
routerProduct.post('/config', product.listConfProducts);

export default routerProduct;