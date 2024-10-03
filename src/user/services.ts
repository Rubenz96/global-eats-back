import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { selUserSideBarPermission } from './query';

export async function sidebarConfig(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        console.log(use_id);
        let resSelSide = await client.query(selUserSideBarPermission({ use_id }));
        await client.query('COMMIT');
        return res.status(OK).json({
            msg: "Exitoso",
            sideConfig: resSelSide.rows,
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