import nodemailer from 'nodemailer';
import { mailConfig } from '../../config/mail';
import { log } from '../../config/log';
import { returnTemplate } from './templates';

interface NotificationData {
    type?: string;
    data?: Record<string, any>;
    reciever?: string;
    files?: Array<{ filename: string, path: string, cid?: string }>;
    cc_list?: string[];
}

async function sendNotification({ type = '', data = {}, files = [], reciever = '', cc_list = [] }: NotificationData): Promise<void> {
    console.log({ type, data, files, cc_list });
    console.log(__dirname);
    try {
        cc_list = cc_list || [];
        files = files || [];
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: mailConfig.port,
            secure: true,
            auth: {
                user: mailConfig.user,
                pass: mailConfig.pass,
            },
        });

        const info = returnTemplate(type, data);
        if (!info) {
            return;
        }
        await transporter.sendMail({
            from: `'Global Eats' <${mailConfig.user}>`,
            to: reciever,
            subject: info.subject,
            html: info.html,
            cc: cc_list,
            attachments: files.concat([{
                filename: 'logo.jpg',
                path: `${__dirname}/../../assets/logo.png`,
                cid: 'logo'
            }])
        });
    } catch (error) {
        console.error(error);
        log({ type: 'MAIL', value: error, function_name: 'sendNotification', description: 'Error - sendNotification()' });
    }
}

export {
    sendNotification,
};