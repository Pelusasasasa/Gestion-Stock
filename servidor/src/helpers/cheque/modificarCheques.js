const Cheque = require('../../models/Cheque');

const modificarCheques = async (cheques, nombre) => {
  try {
    for (let elem of cheques) {
      const cheque = await Cheque.findOne({ numero: elem.numero });
      cheque.ent_a = nombre;
      await cheque.save();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = modificarCheques;
