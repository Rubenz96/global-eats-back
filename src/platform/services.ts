import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { selPageConfig } from './query';

export async function pageConfig(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); 
        let use_id = req.user?.use_id;
        let url = req.body?.url;

        let resSelPageComponent = await client.query(selPageConfig({ use_id: use_id, url }));

        if (!resSelPageComponent.rowCount) {
            return res.status(NOT_FOUND).json({
                msg: "Error al ingresar producto"
            });
        }

        await client.query('COMMIT');
        return res.status(OK).json({
            components: resSelPageComponent.rows
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
