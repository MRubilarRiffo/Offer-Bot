const server = require('./src/server');
const { conn } = require('./src/db');
const cron = require('node-cron');
const { getKnasta } = require('./src/scraping/knasta');
const { getJumbo } = require('./src/scraping/Jumbo');
const { logMessage } = require('./src/helpers/logMessage');
const { getUnimarc } = require('./src/scraping/Unimarc');
const { verifyProduct } = require('./src/helpers/verifyProduct');
const { getCocaCola } = require('./src/scraping/Coca Cola');
const { adidas } = require('./src/scraping/Adidas');
// const { getEasy } = require('./src/scraping/Easy');

const PORT = 3001;

const MINUTES = 20

const executeTask = async () => {
    try {
        // await getEasy();
        // await adidas();
        // await getCocaCola() CORREGIR
        await Promise.all([
            adidas(),
            getKnasta(),
            getUnimarc(),
            getJumbo()
        ]);
        
        logMessage('Tarea programada ejecutada');
    } catch (error) {
        logMessage(`Error al ejecutar la tarea programada: ${error}`);
    } finally {
        setTimeout(executeTask, MINUTES * 60 * 1000);
    };
};

conn.sync({ force: false })
    .then(() => {
        server.listen(PORT, () => logMessage(`Server listening on port ${PORT}`));
    })
    .then(() => {
        executeTask();
    })
    .then(() => {
        cron.schedule('*/10 * * * *', verifyProduct);
    })
    .catch(error => logMessage(error));
