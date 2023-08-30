const server = require('./src/server');
const { conn } = require('./src/db');
const cron = require('node-cron');
const { getKnasta } = require('./src/scraping/knasta');
const { getJumbo } = require('./src/scraping/Jumbo');

const PORT = 3001;

const executeTask = async () => {
    try {
        await getJumbo();
        // await getKnasta();
        console.log('Tarea programada ejecutada');
    } catch (error) {
        console.error('Error al ejecutar la tarea programada:', error);
    } finally {
        setTimeout(executeTask, 600000);
    }
};

conn.sync({ force: false })
    .then(() => {
        server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .then(() => {
        // executeTask();
    })
    .catch(error => console.log(error));
