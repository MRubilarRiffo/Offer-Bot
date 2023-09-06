const server = require('./src/server');
const { conn } = require('./src/db');
// const cron = require('node-cron');
const { getKnasta } = require('./src/scraping/knasta');
const { getJumbo } = require('./src/scraping/Jumbo');
const { logMessage } = require('./src/helpers/logMessage');
const { getUnimarc } = require('./src/scraping/Unimarc');
const { getEasy } = require('./src/scraping/Easy');

const PORT = 3001;

const executeTask = async () => {
    try {
        // await getJumbo();
        // await getKnasta();
        await getEasy();
        // await getUnimarc();
        logMessage('Tarea programada ejecutada');
    } catch (error) {
        logMessage(`Error al ejecutar la tarea programada: ${error}`);
    } finally {
        setTimeout(executeTask, 600000);
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
