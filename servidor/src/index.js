const app = require('./app');

require('./dataBase');
const migrarMarcasProductos = require('./helpers/migrarMarcasProductos');

async function main() {
    await app.listen(app.get('port'));
    migrarMarcasProductos();
}

main();