
import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { insLogin, insUsePassword, selSidebarConfig, selUser, selUseUserLogin, updDeacSpecToken, updUsePassword } from './querys';
import { saltRoundsHash, seedToken } from '../../config/general';
import { sign } from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { NOT_FOUND, OK } from '../../config/status_code';
import { log } from '../../config/log';
import { getRandom } from '../services/general';
import { sendNotification } from '../mailing/services';


export async function login(req: Request, res: Response) {
    console.log('LOOGINNNN')
    const { username, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let dataUser = await client.query(selUser({ username, password }));
        log({ value: dataUser.rows });
        // log({ msg: dataUser.rows }); 
        if (dataUser.rowCount == 0) {
            return res.status(NOT_FOUND).json({
                msg: "Error en los datos"
            });
        }

        if (!dataUser.rows[0].is_valid) {
            return res.status(NOT_FOUND).json({
                msg: "Constraseña invalida"
            });
        }
        let tokenData = {
            use_id: dataUser.rows[0].use_id,
            use_id_: dataUser.rows[0].use_id_,
            use_name: dataUser.rows[0].use_name,
            use_lastname: dataUser.rows[0].use_lastname,
            use_username: dataUser.rows[0].use_username,
        };

        let token = sign(tokenData, seedToken, { expiresIn: 60 * 60 * 24 });

        log({ value: tokenData });
        log({ value: token });
        // let sidebar = await client.query(selSidebarConfig);

        if (token && tokenData) {
            // log({ msg: 'Entra' });

            await client.query(insLogin, [dataUser.rows[0].use_id, token]);
            await client.query('COMMIT');
            return res.status(OK).json({
                msg: "Login exitoso",
                userData: tokenData,
                token: token,
                // sidebar: sidebar.rows
            });
        } else {
            return res.status(NOT_FOUND).json({
                msg: "Error en los datos"
            });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        return res.status(NOT_FOUND).json({
            msg: "Error inesperado"
        });
    } finally {
        client.release();
    }
}


export async function logout(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
            console.log(token)
            let resUpdDeacSpecToken = await client.query(updDeacSpecToken, [token]);
            await client.query('COMMIT');
            return res.status(OK).json({
                msg: "Exitoso",
            });
        } else {
            return res.status(NOT_FOUND).json({
                msg: "Error en los datos"
            });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        // log({ msg: error });
    } finally {
        client.release();
    }
}

export async function recovery(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let username = req.body.username;
        let newPass = getRandom(8);
        log({ type: 'INFO', value: newPass, description: `${username} - Nueva contraseña.` });
        let updPassRes = await client.query(updUsePassword({ username }));
        console.log(updPassRes.rows);

        if (updPassRes.rows && updPassRes.rows.length > 0 && newPass) {
            let resInsPass = await client.query(insUsePassword({ username, newPass }));
            if (resInsPass.rows && resInsPass.rows.length > 0) {
                await client.query('COMMIT');
                sendNotification({ type: 'NEW-HASH', data: { newPass }, reciever: resInsPass.rows[0].mail });
                return res.status(OK).json({
                    msg: "Exitoso",
                });
            } else {
                return res.status(NOT_FOUND).json({
                    msg: "Error"
                });
            }
        }
        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(error);

        log({ type: 'ERROR', value: error });

        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
        // log({ msg: error });
    } finally {
        client.release();
    }
}

export async function password(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let newPass = req.body.newPass;

        let updPassRes = await client.query(updUsePassword({ use_id: req.user?.use_id }));

        if (updPassRes.rows && updPassRes.rows.length > 0 && newPass) {
            let resInsPass = await client.query(insUsePassword({ use_id: req.user?.use_id, newPass }));
            console.log(resInsPass.rows);

            if (resInsPass.rows && resInsPass.rows.length > 0) {
                await client.query('COMMIT');
                // sendNotification({ type: 'NEW-HASH', data: { newPass }, cc_list: [resInsPass.rows[0].mail] });
                return res.status(OK).json({
                    msg: "Exitoso",
                });
            } else {
                return res.status(NOT_FOUND).json({
                    msg: "Error"
                });
            }
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(error);

        log({ type: 'ERROR', value: error });

        return res.status(NOT_FOUND).json({
            msg: "Error"
        });
        // log({ msg: error });
    } finally {
        client.release();
    }
}

