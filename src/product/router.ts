import { Router } from 'express';
const routerProduct = Router();

//USER
import * as product from './services';
routerProduct.post('/new', product.newProduct);
// routerProduct.post('/logout', user.logout);
// routerProduct.post('/recovery', user.recovery); 
// routerProduct.post('/password', user.password); 

export default routerProduct;