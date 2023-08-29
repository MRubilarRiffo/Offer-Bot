const server = require('./src/server');
const { conn } = require('./src/db');
const cron = require('node-cron');
const { getKnasta } = require('./src/store requests/knasta');

const PORT = 3001;

conn.sync({ force: false })
    .then(() => {
        server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .then(() => {
        cron.schedule('*/1 * * * *', async () => {
            try {
                // Aquí puedes agregar tu código para consumir las APIs y guardar los datos
                // utilizando fetch y sequelize
                await getKnasta();
                console.log('Tarea programada ejecutada');
            } catch (error) {
                console.error('Error al ejecutar la tarea programada:', error);
            };
        });
    })
    .catch(error => console.log(error));
