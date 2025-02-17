

import { worksheetModel } from "../models/general";
import { User } from "../models/user";
import XLSX from "xlsx";
import * as fs from 'fs';
import { log } from "../../config/log";

export function jsonToXlsx(hojas: worksheetModel[], fileName: string, folder: string) {
    const workbook = XLSX.utils.book_new();
    for (let i = 0; i < hojas.length; i++) {
        const hoja: any = hojas[i];
        const worksheet = XLSX.utils.json_to_sheet(hoja.data);
        XLSX.utils.book_append_sheet(workbook, worksheet, hoja.name);
    }

    let path = `${__dirname}/files/${folder}/${fileName}`;
    console.log(path);
    XLSX.writeFile(workbook, path, { compression: true });
    return { filename: fileName, path };
}

export function getRandom(longitud: number): string {
    try {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        const caracteresLength = caracteres.length;

        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
        }
        return resultado;
    } catch (error) {
        return '666';
    }
}

export function verifyFolder(folder: string): boolean {
    try {
        let path = `${__dirname}/files/${folder}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            log({ method: 'verifyFolder', type: 'INFO', description: `El directorio ${path} ha sido creado.` });
        } else {
            log({ method: 'verifyFolder', type: 'INFO', description: `El directorio ${path} ya existe.` });
        }
        return true;
    } catch (error) {
        log({ value: error, method: 'verifyFolder', type: 'ERROR' });
        return false;
    }
}

export function orderData(data: any[]) {
    // const columnOrder = ['id', 'created_at', 'author_id', 'text', 'lang', 'conversation_id'];
    const columnOrder = ['lang', 'text', 'created_at', 'text', 'referenced_tweets[0].type', 'conversation_id', 'id'];
    return data.map((item: any) => {
        let orderedItem: any = {};
        columnOrder.forEach(col => {
            if (item.hasOwnProperty(col)) {
                orderedItem[col] = item[col] ? item[col] : '';
            }
        });
        Object.keys(item).forEach(key => {
            if (!orderedItem.hasOwnProperty(key)) {
                orderedItem[key] = item[key] ? item[key] : '';
            }
        });
        return orderedItem;
    });
};