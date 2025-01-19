import express from 'express';
import fs from 'fs'; // Importar el módulo fs
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

// Definir una ruta básica
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Agregar una nueva ruta para servir los logs
app.get('/logs', (req, res) => {
  const logFilePath = '/home/node/logs/server.log'; // Ruta del archivo de logs

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo de logs');
    }
    res.send(`<pre>${data}</pre>`); // Enviar el contenido del log como respuesta
  });
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
