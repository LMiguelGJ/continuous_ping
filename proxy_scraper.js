const SocksScraper = require('socks-scraper');
// https://github.com/makarasty/socks-scraper/tree/main

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

async function obtenerProxiesValidados() {
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

module.exports = obtenerProxiesValidados;
