const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');
const path = require('path');
const axios = require('axios');

let proxiesCache = null;

const loadProxies = () => {
    const proxiesFilePath = path.join(__dirname, '..', 'files', 'proxies.txt');
    const proxies = fs.readFileSync(proxiesFilePath, 'utf-8').trim().split('\n');
    proxiesCache = proxies;
    return proxies;
};

const getRandomProxy = (proxies) => {
    const proxyDetails = proxies[Math.floor(Math.random() * proxies.length)];
    const [ip, port, user, password] = proxyDetails.split(':');
    return `socks5://${user}:${password}@${ip}:${port}`;
};

const requestsAPI = async (url, retryCount = 3) => {
    const proxies = proxiesCache || loadProxies();
    
    for (let i = 0; i < retryCount; i++) {
        try {
            const proxyUrl = getRandomProxy(proxies);
            const agent = new SocksProxyAgent(proxyUrl);
            const response = await axios.get(url, {
                httpsAgent: agent
            });
            return response.data;
        } catch (error) {
            if (i === retryCount - 1) {
                throw error;
            }
            console.warn(`Attempt ${i + 1} failed. Retrying...`);
        };
    };
};

module.exports = { requestsAPI };