const Numero = require("../models/Numero");

exports.actualizarNumero = async(tipo_venta) => {

    try {

        let tipo = '';

        switch (tipo_venta) {
            case 'CD':
                tipo = 'Contado';
                break;
            case 'CC':
                tipo = 'Cuenta Corriente';
                break;
            case 'RT':
                tipo = 'Remito';
                break;
            case 'PP':
                tipo = 'Presupuesto';
                break;
            case 'RECIBO':
                tipo = 'Recibo';
                break;
            default:
                tipo = 'Contados';
                break;
        };

        const numero = await Numero.findOneAndUpdate({}, {
            $inc: {
                [tipo]: 1
            }
        });


        await numero.save();

        return {
            ok: true,
            numero: numero[tipo]
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false
        }
    }
    
};