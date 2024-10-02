
import { Blowfish } from 'javascript-blowfish';
var blowfishInstance = new Blowfish("Abogado con muchas especialidades");


export function toBinary(data: string) {
    const codeUnits = new Uint16Array(data.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = data.charCodeAt(i);
    }
    return encodeBase64(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

export function fromBinary(encoded: string) {
    //log.info(encoded)
    let binary = decodeBase64(encoded)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}


export function encriptar(mensaje: string) {
    var encrypted = blowfishInstance.encrypt(mensaje);
    let encriptado = toBinary(encrypted)
    return encriptado;
}

export function desencriptar(mensaje_encriptado: string) {
    let from_binary = fromBinary(mensaje_encriptado.replace('Bearer ', ''));
    var decrypted = blowfishInstance.decrypt(from_binary);
    let decrypted2 = blowfishInstance.trimZeros(decrypted);
    return decrypted2;
}


export const encodeBase64 = (data: string) => {
    return Buffer.from(data).toString('base64');
}
export const decodeBase64 = (data: string) => {
    return Buffer.from(data, 'base64').toString('ascii');
}