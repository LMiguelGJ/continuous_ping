import express from 'express';
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

// Definir una ruta básica
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
