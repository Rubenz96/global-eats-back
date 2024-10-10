const new_password = (data: any): string => {
    return `<!DOCTYPE html>
            <html lang="es">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap" rel="stylesheet">
            </head>

            <body style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans'">
                <div style="padding: 20px 36px; height: 70px;">
                    <div style="height: 70px; background-color: #FFF; text-align: center;">
                        <div style="display: inline;">
                            <img src="cid:logo" alt="logo" style="height: 70px;" />
                        </div>
                    </div>
                </div>
                <div style="height: 100%; background-color: #ffffff; padding: 10px 36px;">
                    <h1
                        style="font-family: 'Mulish', sans-serif; font-size: 24px; font-weight: 700; color: #35633a; text-align: center; padding-top: 36px; margin: 0 0 50px 0;">
                        ¡Contraseña provisoria!
                    </h1>
                    <p
                        style="font-family: 'Mulish', sans-serif; font-size: 16px; text-align: justify; line-height: 23px; color: #3F3F3F; font-weight: 400; margin-bottom: 20px;">
                        Su nueva contraseña es <strong>${data.newPass}</strong>
                    </p>
                </div>
            </body>

            </html>`;
}

const template_error = (data: any): string => {
    return `<!DOCTYPE html>
                <html lang="es">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap" rel="stylesheet">
                </head>
                
                <body style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans'">
                    <div style="padding: 20px 36px; height: 70px;">
                        <div style="height: 70px; background-color: #FFF; text-align: center;">
                            <div style="display: inline;">
                                <img src="cid:logo" alt="logo" style="height: 70px;" />
                            </div>
                        </div>
                    </div>
                    <div style="height: 100%; background-color: #ffffff; padding: 10px 36px;">
                        <h1
                            style="font-family: 'Mulish', sans-serif; font-size: 24px; font-weight: 700; color: #35633a; text-align: center; padding-top: 36px; margin: 0 0 50px 0;">
                            ¡Error en descarga de datos!
                        </h1>
                        <p
                            style="font-family: 'Mulish', sans-serif; font-size: 16px; text-align: justify; line-height: 23px; color: #3F3F3F; font-weight: 400; margin-bottom: 20px;">
                            Error a la hora de descargar tweets de <strong>${data.query ? data.query : data.username}</strong>.
                        </p>
                    </div>
                </body>
                </html>`;
}

const template_default = (data: any): string => {
    return `<!DOCTYPE html>
                <html lang="es">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap" rel="stylesheet">
                </head>
                
                <body style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans'">
                    <div style="padding: 20px 36px; height: 70px;">
                        <div style="height: 70px; background-color: #FFF; text-align: center;">
                            <div style="display: inline;">
                                <img src="cid:logo" alt="logo" style="height: 70px;" />
                            </div>
                        </div>
                    </div>
                    <div style="height: 100%; background-color: #ffffff; padding: 10px 36px;">
                        <h1
                            style="font-family: 'Mulish', sans-serif; font-size: 24px; font-weight: 700; color: #35633a; text-align: center; padding-top: 36px; margin: 0 0 50px 0;">
                            ${data.title}
                        </h1>
                        <p
                            style="font-family: 'Mulish', sans-serif; font-size: 16px; text-align: justify; line-height: 23px; color: #3F3F3F; font-weight: 400; margin-bottom: 20px;">
                            ${data.msg}
                        </p>
                    </div>
                </body>
                </html>`;
}

function returnTemplate(template: string, data: any) {
    if (template === 'ERROR') {
        return {
            html: template_error(data),
            subject: `ERROR - GLOBAL EATS`
        };
    } else if (template === 'NEW-HASH') {
        return {
            html: new_password(data),
            subject: `NUEVA CONTRASEÑA - GLOBAL EATS`
        };
    } else if (template === 'DEFAULT') { 
        return {
            html: template_default(data),
            subject: `${data && data.subject ? data.subject : 'INFORMACIÓN'} - GLOBAL EATS`
        };
    }
    return false;
}

export {
    returnTemplate,
};