<VirtualHost *:80>
    ServerName 45.236.129.234

    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/mediatips

    <Directory /var/www/html/mediatips>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Redirigir solicitudes a la API backend
    ProxyPass /api/ http://127.0.0.1:5000/
    ProxyPassReverse /api/ http://127.0.0.1:5000/

    # Asegurarse de que las solicitudes de archivos JavaScript reciban el MIME type correcto
    <FilesMatch "\.(js|mjs)$">
        AddType application/javascript .js
        AddType application/javascript .mjs
    </FilesMatch>

    # Redirigir todas las demás solicitudes al frontend, excepto las que son para la API
    <IfModule mod_rewrite.c>
        RewriteEngine On
        # Excluir las rutas de la API de la reescritura
        RewriteCond %{REQUEST_URI} !^/api/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ /index.html [L]
    </IfModule>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
    ProxyRequests Off
</VirtualHost>
