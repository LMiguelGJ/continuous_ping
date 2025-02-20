import express from 'express'; 
import fs from 'fs';
import { exec } from 'child_process';
import SocksScraper from 'socks-scraper';
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en la variable de entorno

var proxyInfo = '<div>Nada por ahora</div>'

// Función para obtener proxies validados
async function obtenerProxiesValidados() {
    // Inicializar el scraper con una lista de sitios de proxies
    const socksScraper = new SocksScraper([
        "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt",
        "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks4/socks4.txt",
        "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks5/socks5.txt",
        'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=socks4',
        'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=socks5',
    ]);

    // Añadir más sitios a la lista
    socksScraper.addSites(["https://api.proxyscrape.com/?request=displayproxies&status=alive"]);

    // Configuración de tiempo de espera y otros parámetros
    const timeout = 10000;
    const chunkSize = 5000;
    const retryCount = 5;

    // Actualizar proxies no verificados
    await socksScraper.updateUncheckedProxies();

    // Obtener y verificar proxies socks4
    const wsp4 = await socksScraper.getWorkedSocksProxies('socks4', timeout, chunkSize, undefined, undefined, retryCount);
    const bestWSP4 = SocksScraper.filterByLatency(wsp4)[0];

    // Obtener y verificar proxies socks5
    const wsp5 = await socksScraper.getWorkedSocksProxies('socks5', timeout, chunkSize, undefined, undefined, retryCount);
    const bestWSP5 = SocksScraper.filterByLatency(wsp5)[0];

    // Retornar los mejores proxies encontrados
    return {
        bestSocks4: bestWSP4,
        bestSocks5: bestWSP5,
        allSocks4: wsp4,
        allSocks5: wsp5
    };
}

// Llamar a la función y manejar la promesa
obtenerProxiesValidados().then(proxies => {
    proxyInfo = `
    <div>Mejor proxy SOCKS4: ${proxies.bestSocks4}</div>
    <div>Mejor proxy SOCKS5: ${proxies.bestSocks5}</div>
    <div>Todos los proxies SOCKS4: ${proxies.allSocks4.join(', ')}</div>
    <div>Todos los proxies SOCKS5: ${proxies.allSocks5.join(', ')}</div>
  `;

    console.log('Mejor proxy SOCKS4:', proxies.bestSocks4);
    console.log('Mejor proxy SOCKS5:', proxies.bestSocks5);
    console.log('Todos los proxies SOCKS4:', proxies.allSocks4);
    console.log('Todos los proxies SOCKS5:', proxies.allSocks5);

}).catch(error => {
    console.error('Error al obtener proxies:', error);
});

app.get('/', (req, res) => {
  const logFilePath = '/home/node/server.log'; // Ruta del archivo de logs

  exec('curl http://ip-api.com/json/', (err, stdout, stderr) => {
    let bannerContent;
    if (err) {
      bannerContent = `Error al obtener la IP pública: ${stderr}`;
    } else {
      try {
        const response = JSON.parse(stdout);
        if (response.status === 'success') {
          bannerContent = `
            <div>IP: ${response.query}</div>
            <div>Country: ${response.country}</div>
            <div>Region: ${response.regionName}</div>
            <div>City: ${response.city}</div>
            <div>ISP: ${response.isp}</div>
            ${proxyInfo}
          `;
        } else {
          bannerContent = `Error en la respuesta de la API: ${stdout}`;
        }
      } catch (parseError) {
        bannerContent = `Error al analizar la respuesta de la API: ${parseError.message}. Respuesta del servidor: ${stdout}`;
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
              #content { margin-top: 100px; }
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
