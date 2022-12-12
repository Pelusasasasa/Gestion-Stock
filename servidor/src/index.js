const app = require('./app');

require('./dataBase');

async function main() {
    await app.listen(app.get('port'));
}

main();