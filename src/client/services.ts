import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { countClients, delClientQue, insClient, insClientInventory, insClientPrice, selClients } from './query';

export async function newClient(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { name, description, quantity, price, from_date, to_date } = req.body;
        let resInsProd = await client.query(insClient, [name, description]);
        if (!resInsProd.rowCount || resInsProd.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error al ingresar producto"
            });
        }
        let pro_id = resInsProd.rows[0].pro_id;
        let resInsClientPrice = await client.query(insClientPrice, [pro_id, price, from_date, to_date, use_id]);
        let resInsClientInventory = await client.query(insClientInventory, [pro_id, quantity]);

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

export async function listClients(req: Request, res: Response) {
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

        const resSelAllClients = await client.query(selClients(filter), [pageSize, pageNumber]);
        const resCountClients = await client.query(countClients(filter), [pageSize]);


        if (resCountClients.rowCount == 0) {
            return res.status(NOT_FOUND).send({ status: false, msg: 'Error no identificado' });
        }
        res.status(OK).send(
            {
                status: true,
                products: resSelAllClients.rows,
                page: {
                    quantity: resCountClients.rows[0].quantity,
                    pages: resCountClients.rows[0].pages,
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

export async function delClient(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { pro_id_ } = req.body;
        let resDelProd = await client.query(delClientQue, [pro_id_]);
        if (!resDelProd.rowCount || resDelProd.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error al desactivar producto"
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