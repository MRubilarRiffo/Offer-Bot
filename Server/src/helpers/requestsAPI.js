const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');
const path = require('path');
const axios = require('axios');

let proxiesCache = null;
let userAgentCache = null;

const loadProxies = () => {
    const proxiesFilePath = path.join(__dirname, '..', '..', 'Files', 'proxies.txt');
    const proxies = fs.readFileSync(proxiesFilePath, 'utf-8').trim().split('\n');
    proxiesCache = proxies;
    return proxies;
};

const getRandomProxy = (proxies) => {
    const proxyDetails = proxies[Math.floor(Math.random() * proxies.length)];
    const [ip, port, user, password] = proxyDetails.split(':');
    return `socks5://${user}:${password}@${ip}:${port}`;
};

const loadUserAgent = () => {
    const userAgentFilePath = path.join(__dirname, '..', '..', 'Files', 'user-agent.txt');
    const userAgent = fs.readFileSync(userAgentFilePath, 'utf-8').trim().split('\n');
    userAgentCache = userAgent;
    return userAgent;
};

const getRandomUserAgent = (userAgent) => {
    const userAgentDetails = userAgent[Math.floor(Math.random() * userAgent.length)];
    return userAgentDetails.trim();
};

const requestsAPI = async (url, headers = {}, retryCount = 3) => {
    const proxies = proxiesCache || loadProxies();
    const userAgent = userAgentCache || loadUserAgent();
    
    for (let i = 0; i < retryCount; i++) {
        try {
            const proxyUrl = getRandomProxy(proxies);
            const userAgentUrl = getRandomUserAgent(userAgent);
            headers['User-Agent'] = userAgentUrl;
            const agent = new SocksProxyAgent(proxyUrl);
            const response = await axios.get(url, {
                httpsAgent: agent,
                headers: headers
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