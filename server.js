import express from 'express'; 
import fs from 'fs';
import { exec } from 'child_process';
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

app.get('/', (req, res) => {
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs

  exec('curl http://ip-api.com/line', (err, stdout, stderr) => {
    let bannerContent;
    if (err) {
      bannerContent = `Error al obtener la IP pública: ${stderr}`;
    } else {
      const lines = stdout.split('\n');
      if (lines[0] === 'success') {
        const country = lines[1];
        const ip = lines[8];
        bannerContent = `Public IP: ${ip} (${country})`;
      } else {
        bannerContent = `Error en la respuesta de la API: ${stdout}`;
      }
    }

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
              #banner { background-color: grey; padding: 10px; text-align: center; position: fixed; top: 0; width: 100%; }
              #content { margin-top: 50px; }
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
            <div id="banner">${bannerContent}</div>
            <div id="content">
              <pre>${lastLines}</pre>
            </div>
          </body>
        </html>
      `);
    });
  });
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
