const tls = require('tls');
tls.DEFAULT_CIPHERS = 'DEFAULT@SECLEVEL=1';

const app = require('./app');

require('./dataBase');


async function main() {
    await app.listen(app.get('port'));
   
}

main();