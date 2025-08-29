const Cliente = require("../models/Cliente");

const initCliente =  async() => {
    try {
        const existe = await Cliente.findOne({nombre: 'CONSUMIDOR FINAL'});

        if(!existe){
            await Cliente.create({
                _id: 1,
                telefono: '00000000',
                direccion: 'CHAJARI',
                localidad: 'CHAJARI',
                saldo: 0,
                cuit: '',
                condicionIva: 'Consumidor Final',
                nombre: 'CONSUMIDOR FINAL'
            });

            console.log(`✅ Cliente por defecto creado`);
        }else{
            console.log('ℹ️ Cliente por defecto ya existe');
        };
    } catch (error) {
        console.error(`❌ error al cargar el cliente por defecto: ${error}`);
    };
};

module.exports = initCliente;