
import { Request, Response, NextFunction } from "express";
import { poolSelect } from "../../config/db";
import { log } from "../../config/log";
import { validatePassword } from "../services/general";
import { selApi, selRoutes } from "./query";
import { BAD_GATEWAY, TOKEN_EXPIRED, UNAUTHORIZED } from "../../config/status_code";
import { Route } from "../models/route";

var routes_params: Route[] = [];

export const getApiGateway = () => {
    poolSelect
        .query(selRoutes)
        .then(resp => {
            log({ type: 'INFO', description: 'Parametros de rutas cargadas', value: resp.rows });
            routes_params = resp.rows;
        })
        .catch(error => {
            log({ type: 'ERROR', description: 'Error parametros rutas: ', value: error });
        })
}
// setInterval( () => getApiGateway(), 60*60*1000)
getApiGateway(); //Se cargan al inicio y debe actalizarse cuando se hacen cambios
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////     Validacion de la ruta      ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Se valida que la ruta que se esta tratando consumir exista en el sistema
export const routeValid = (req: Request, res: Response, next: NextFunction) => {
    let val = false;
    for (let route of routes_params) {
        let ruta = route.gat_uri;
        const re = new RegExp(ruta);
        if (route.req_typ_method == req.method && re.test(req.originalUrl)) {
            val = true;
            req.info_route = route;
            log({ routeType: req.method, route: req.originalUrl, description: 'Existe la ruta del servicio' });
            break;
        }
    }
    if (val) {
        next();
    }
    else {
        log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'No existe ruta en bd' })
        return res.status(BAD_GATEWAY).send({ msg: 'Route invalid.' })
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////     Validacion del token      ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Valida el token, si la ruta no está en el listado de rutas qe no se le valida el token
export const tokenValid = (req: Request, res: Response, next: NextFunction) => {
    if (req.info_route && req.info_route.gat_token_valid) {
        //   let token = servicios.desencriptar(req.headers['authorization']);
        let token = req.headers['authorization'];
        // console.log(token);

        if (!token) {
            log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Error JWT: Es necesario el token de autenticación' });
            return res.status(TOKEN_EXPIRED).send({ msg: 'Es necesario el token de autenticación' })
        } else {
            token = token.replace('Bearer ', '');
            poolSelect.query(selApi({ token, httpMethod: req.method, url: req.originalUrl }))
                .then(result => {
                    if (result.rowCount == 0 || !result.rows[0].token_info) {
                        log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Error JWT: Token expirado' });
                        return res.status(TOKEN_EXPIRED).send({ msg: 'Token expirado' });
                    }
                    log({ routeType: req.method, route: req.originalUrl, description: 'Token valido' });
                    req.user = result.rows[0].token_info;
                    req.has_permission = result.rows[0].has_permission;
                    next();
                })
                .catch(error => {
                    log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Error JWT: Token expirado' });
                    return res.status(TOKEN_EXPIRED).send({ msg: 'Token expirado' });
                });
        }
    }
    else {
        next();
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////     Validacion del usuario vigente      ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const userValid = (req: Request, res: Response, next: NextFunction) => {
    // let user = req.token_data;
    // let val = false;

    // if (req.info_route.api_gat_user_valid) {
    //   if (user.use_sta_id != 1) {
    //     log('' + req.originalUrl + '] Usuario use_id: ' + user.use_id + ' NO VIGENTE')
    //     return res.status(UNAUTHORIZED).send({ msg: 'Solicitud no autorizada' })
    //   }
    //   else {
    //     log('' + req.originalUrl + '] Usuario VIGENTE')
    //     next();
    //   }

    // }
    // else {
    next();
    // }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////     Permiso asociado ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const userPermissionValid = (req: Request, res: Response, next: NextFunction) => {
    if (req.info_route && req.info_route.gat_permission_valid) {
        if (!req.user) {
            log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Permiso no asignado.' });
            return res.status(UNAUTHORIZED).send({ msg: 'Solicitud no autorizada' });
        }
        if (req.has_permission) {
            log({ routeType: req.method, route: req.originalUrl, description: 'Permiso asignado.' });
            next();
        } else {
            log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Permiso no asignado.' });
            return res.status(UNAUTHORIZED).send({ msg: 'Solicitud no autorizada' });
        }
    } else {
        log({ routeType: req.method, route: req.originalUrl, description: 'No es necesario validar permiso.' });
        next();
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////     Validacion de los datos      ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Se valida que la ruta que se esta tratando consumir exista en el sistema
export const dataValid = (req: Request, res: Response, next: NextFunction) => {
    let val = false;
    let body = req.body;
    if (req.info_route && req.info_route.gat_condition_valid && req.info_route.conditions && req.info_route.conditions.length > 0) {
        for (let i = 0; i < req.info_route.conditions.length; i++) {
            const condition = req.info_route.conditions[i];
            // console.log(condition)
            let data = {};
            if (condition && condition.gat_con_aditional) {

            } 
            try {
                let validatePass = body && body.newPass ? validatePassword(body.newPass) : false;
                if (!eval(condition.gat_con_condition)) {
                    log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: 'Validación de datos fallida.' });
                    return res.status(BAD_GATEWAY).send({ msg: 'Data invalid.' });
                } 
            } catch (error) {
                console.log(error);

                log({ type: 'ERROR', routeType: req.method, route: req.originalUrl, description: `validación de datos fallida.`, value: error });
                return res.status(BAD_GATEWAY).send({ msg: 'Data invalid.' });
            }
        }
        log({ routeType: req.method, route: req.originalUrl, description: 'Validación de la data lista.' })
        next();
    } else {
        log({ routeType: req.method, route: req.originalUrl, description: 'No necesita validación de la data.' })
        next();
    }
};
