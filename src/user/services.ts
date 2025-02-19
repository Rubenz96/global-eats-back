import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { countUsers, insPermissions, insUser, selPageConfig, selUser, selUsers, selUserSideBarPermission, updUser, updUserDeac } from './query';

export async function sidebarConfig(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        console.log(use_id);
        let resSelSide = await client.query(selUserSideBarPermission({ use_id }));
        let resSelPageComponent = await client.query(selPageConfig({ use_id }));

        await client.query('COMMIT');
        return res.status(OK).json({
            msg: "Exitoso",
            sideConfig: resSelSide.rows,
            permissions: resSelPageComponent.rows
        });

    } catch (error) {
        await client.query('ROLLBACK');
        log({ value: error });
        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
    } finally {
        client.release();
    }
}

export async function getUserBBDD(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let user_id_ = req.params.user_id_;
        console.log(req.params);

        let resUser = await client.query(selUser, [user_id_]);
        await client.query('COMMIT');
        return res.status(OK).json((resUser && resUser.rowCount && resUser.rowCount > 0) ? resUser.rows[0] : false);

    } catch (error) {
        await client.query('ROLLBACK');
        // log({ msg: error });
    } finally {
        client.release();
    }
}

export async function setUserBBDD(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id_ = req.user?.use_id_;
        let { name, lastname, username, } = req.body;
        let resUser = await client.query(updUser, [name, lastname, username, use_id_]);
        await client.query('COMMIT');
        return res.status(OK).json({
            user: (resUser && resUser.rowCount && resUser.rowCount > 0) ? resUser.rows[0] : false,
        });

    } catch (error) {
        await client.query('ROLLBACK');
        // log({ msg: error });
    } finally {
        client.release();
    }
}

export async function listUsers(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let user = req.user;
        let use_id = req.user?.use_id;
        let pageNumber = req.body.pageNumber;
        let pageSize = req.body.pageSize;
        let filter = req.body.filter;
        if (!pageNumber || !pageSize || pageSize > 100) {
            return res.status(NOT_FOUND).send({ status: false, msg: 'PARAMETROS NO VALIDOS' });
        }

        const resSelAllUsers = await client.query(selUsers(filter), [pageSize, pageNumber]);
        const resCountUsers = await client.query(countUsers(filter), [pageSize]);


        if (resCountUsers.rowCount == 0) {
            return res.status(NOT_FOUND).send({ status: false, msg: 'Error no identificado' });
        }
        res.status(OK).send(
            {
                status: true,
                users: resSelAllUsers.rows,
                page: {
                    quantity: resCountUsers.rows[0].quantity,
                    pages: resCountUsers.rows[0].pages,
                    pageNumber,
                    filter
                }
            });
    } catch (error) {
        await client.query('ROLLBACK');
        log({ value: error });
        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
    } finally {
        client.release();
    }
}

export async function delUser(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { use_id_ } = req.body;
        let resDelUser = await client.query(updUserDeac, [use_id_]);
        if (!resDelUser.rowCount || resDelUser.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error al desactivar usuario"
            });
        }
        await client.query('COMMIT');
        return res.status(OK).json({
            msg: "Exitoso",
        });

    } catch (error) {
        await client.query('ROLLBACK');
        log({ value: error });
        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
    } finally {
        client.release();
    }
}

export async function createUser(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const body = req.body;
        console.log(body);

        let resInsUser = await client.query(insUser(body));
        if (!resInsUser.rowCount || resInsUser.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error al crear usuario"
            });
        }
        let resInsPermissions = await client.query(insPermissions({ use_id: resInsUser.rows[0].use_id, permissions: body.permissions }));

        await client.query('COMMIT');
        return res.status(OK).json({
            msg: "Exitoso",
        });

    } catch (error) {
        await client.query('ROLLBACK');
        log({ value: error });
        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
    } finally {
        client.release();
    }
}