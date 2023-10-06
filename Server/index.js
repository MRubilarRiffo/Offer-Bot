const server = require('./src/server');
const { conn } = require('./src/db');

const { getKnasta } = require('./src/scraping/knasta');
const { getJumbo } = require('./src/scraping/Jumbo');
const { logMessage } = require('./src/helpers/logMessage');
const { getUnimarc } = require('./src/scraping/Unimarc');
// const { getCocaCola } = require('./src/scraping/Coca Cola');
const { getAdidas } = require('./src/scraping/Adidas');
const { getZapatos } = require('./src/scraping/Zapatos');
// const { getEasy } = require('./src/scraping/Easy');

const PORT = 3001;

const MINUTES = 20

const executeTask = async () => {
    try {
        // await getEasy();
        // await getAdidas();
        // await getCocaCola() CORREGIR

        await Promise.all([
            // getKnasta(),
            getAdidas(),
            // getUnimarc(),
            // getJumbo(),
            // getZapatos()
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
    .catch(error => logMessage(error));
