import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { insProduct, insProductInventory, insProductPrice } from './query';

export async function newProduct(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { name, description, quantity, price, from_date, to_date } = req.body;
        let resInsProd = await client.query(insProduct, [name, description]);
        if(!resInsProd.rowCount || resInsProd.rowCount == 0){
            return res.status(NOT_FOUND).json({
                msg: "Error al ingresar producto"
            });
        }
        let pro_id = resInsProd.rows[0].pro_id;
        let resInsProductPrice = await client.query(insProductPrice, [pro_id, price,from_date,to_date,use_id]);
        let resInsProductInventory = await client.query(insProductInventory, [pro_id, quantity]);

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
