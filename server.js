import express from 'express'; 
import fs from 'fs';
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

app.get('/', (req, res) => {
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo de logs');
    }

    // Dividimos el archivo en líneas y tomamos solo las últimas 100
    const lines = data.split('\n');
    const lastLines = lines.slice(-100).join('\n');

    res.send(`
      <html>
        <head>
          <style>
            body { background-color: black; color: white; font-family: monospace; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
          <script>
            setInterval(() => {
              window.location.reload();
            }, 5000);
            setInterval(() => {
              window.scrollTo(0, document.body.scrollHeight);
            }, 5000);
          </script>
        </head>
        <body>
          <pre>${lastLines}</pre>
        </body>
      </html>
    `);
  });
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
