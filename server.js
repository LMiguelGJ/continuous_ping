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
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs

  // Verificar si el archivo existe
  fs.access(logFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Archivo de logs no encontrado');
    }

    // Leer el archivo de logs
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error al leer el archivo de logs');
      }

      // Verificar si el contenido está corrupto (ejemplo simple)
      if (!data || data.trim() === '') {
        return res.status(500).send('El archivo de logs está vacío o corrupto');
      }

      res.send(`<pre>${data}</pre>`); // Enviar el contenido del log como respuesta
    });
  });
  
  // Mostrar el contenido del directorio donde se encuentra el archivo
  fs.readdir('/home/node', (err, files) => {
    if (err) {
      console.error('Error al leer el directorio:', err);
      return;
    }
    console.log('Contenido del directorio:', files);
  });
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
