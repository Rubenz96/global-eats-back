import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { selPageConfig, selUser, selUserSideBarPermission, updUser } from './query';

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
        log({ value : error });
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
        let user_id_ = req.user?.use_id_;
        let resUser = await client.query(selUser, [user_id_]);
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

export async function setUserBBDD(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let user_id_ = req.user?.use_id_;
        let { name, lastname, username, } = req.body;
        let resUser = await client.query(updUser, [name, lastname, username, user_id_]);
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