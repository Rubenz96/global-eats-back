import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { permissionsAviables } from './query';


export async function listPermissions(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let resSelPermissions = await client.query(permissionsAviables);
        if (!resSelPermissions.rowCount) {
            return res.status(NOT_FOUND).json({
                msg: "Error al traer permisos"
            });
        }
        await client.query('COMMIT');
        return res.status(OK).json({
            msg: "Exitoso",
            permissions: resSelPermissions.rows,
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