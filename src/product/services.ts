import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { log } from '../../config/log';
import { NOT_FOUND, OK } from '../../config/status_code';
import { countProducts, delProductQue, insProCalCon, insProduct, insProductInventory, insProductPrice, selCaliberQue, selContainerQue, selContXCalbQue, selProducts } from './query';

export async function newProduct(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { name, description, quantity, price, from_date, to_date, calibers } = req.body;
        let resInsProd = await client.query(insProduct, [name, description]);
        if (!resInsProd.rowCount || resInsProd.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error al ingresar producto"
            });
        }
        let pro_id = resInsProd.rows[0].pro_id;
        let resInsProductPrice = await client.query(insProductPrice, [pro_id, price, from_date, to_date, use_id]);
        let resInsProductInventory = await client.query(insProductInventory, [pro_id, quantity]);
        let insQueProConCal = await client.query(insProCalCon({calibers, pro_id}));
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

export async function listProducts(req: Request, res: Response) {
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

        const resSelAllProducts = await client.query(selProducts(filter), [pageSize, pageNumber]);
        const resCountProducts = await client.query(countProducts(filter), [pageSize]);


        if (resCountProducts.rowCount == 0) {
            return res.status(NOT_FOUND).send({ status: false, msg: 'Error no identificado' });
        }
        res.status(OK).send(
            {
                status: true,
                products: resSelAllProducts.rows,
                page: {
                    quantity: resCountProducts.rows[0].quantity,
                    pages: resCountProducts.rows[0].pages,
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

export async function delProduct(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let use_id = req.user?.use_id;
        const { pro_id_ } = req.body;
        let resDelProd = await client.query(delProductQue, [pro_id_]);
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

export async function listConfProducts(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resSelCalibers = await client.query(selContXCalbQue);
        res.status(OK).send(
            {
                config: resSelCalibers.rows,
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