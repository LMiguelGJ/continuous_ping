import express from 'express';
import fs from 'fs'; // Importar el módulo fs
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

// Agregar una nueva ruta para servir los logs
app.get('/', (req, res) => {
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs

 // Obtener las últimas 100 líneas del log para optimizar rendimiento
  exec(`tail -n 100 ${logFilePath}`, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.status(500).send('Error al leer el archivo de logs');
    }
    
    // Modificación para cambiar el fondo a negro y recargar cada 5 segundos
    res.send(`
      <html>
        <head>
          <style>
            body { background-color: black; color: white; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
          <script>
            setInterval(() => {
              window.location.reload();
            }, 50000);
            setInterval(() => {
              window.scrollTo(0, document.body.scrollHeight);
            }, 5000);
          </script>
        </head>
        <body>
          <pre>${data}</pre>
        </body>
      </html>
    `); // Enviar el contenido del log como respuesta
  });
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
