import express from 'express'; 
import fs from 'fs';
import axios from 'axios';
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

app.get('/', async (req, res) => {
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs
  let bannerContent = ''; // Asegúrate de que bannerContent esté definido

    try {
      const response = await axios.get('http://ip-api.com/json/');
      const data = response.data;

      if (data.status === 'success') {
        // Consulta a ProxyCheck para verificar si la IP está bajo un proxy
        const proxyResponse = await axios.get(`https://proxycheck.io/v2/${data.query}?vpn=1&risk=1&port=1&seen=1&days=7&tag=msg`);
        const proxyData = proxyResponse.data;

        bannerContent = `
          <div>IP: ${data.query}</div>
          <div>Country: ${data.country}</div>
          <div>Region: ${data.regionName}</div>
          <div>City: ${data.city}</div>
          <div>ISP: ${data.isp}</div>
          <div>Proxy: ${proxyData[data.query].proxy}</div>
          <div>Tipo: ${proxyData[data.query].type}</div>
          <div>Organización: ${proxyData[data.query].organisation}</div>
          <div>Riesgo: ${proxyData[data.query].risk}</div>
        `;
        ipDataFetched = true; // Marca que la IP ha sido obtenida
      } else {
        bannerContent = `Error en la respuesta de la API: ${JSON.stringify(data)}`;
      }
    } catch (error) {
      bannerContent = `Error al obtener la IP pública: ${error.message}`;
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
            #banner { 
              background-color: grey; 
              padding: 10px; 
              text-align: center; 
              position: fixed; 
              top: 0; 
              right: 0; 
              width: auto; 
              z-index: 1000; 
            }
            #content { /* margin-top: 100px; */ }
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

// Asegúrate de que está escuchando en 0.0.0.0 para que sea accesible externamente
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
