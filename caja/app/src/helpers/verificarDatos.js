import Swal from "sweetalert2";

export const verificarDatosTarjeta = async ({ fecha, nombre, importe, tarjeta }) => {

    if (!fecha) {
        await Swal.fire('Error al cargar Tarjeta', 'La fecha es obligatoria', 'error');
        return false;
    };
    if (!nombre) {
        await Swal.fire('Error al cargar Tarjeta', 'El nombre es obligatorio', 'error');
        return false;
    }
    if (!importe) {
        await Swal.fire('Error al cargar Tarjeta', 'El importe es obligatorio', 'error');
        return false;
    }
    if (!tarjeta) {
        await Swal.fire('Error al cargar Tarjeta', 'la tarjeta es obligatoria', 'error');
        return false;
    }

};

export const verificarDatosCheque = async ({ f_recibido, banco, numero, importe, f_cheque, ent_por }) => {

    if (!f_recibido) {
        await Swal.fire('Error al cargar Cheque', 'La fecha que se recibio es obligatorio', 'error');
        return false;
    };

    if (!numero) {
        await Swal.fire('Error al cargar Cheque', 'El numero es obligatorio', 'error');
        return false;
    };
    if (!banco) {
        await Swal.fire('Error al cargar Cheque', 'El banco es obligatorio', 'error');
        return false;
    };
    if (!importe) {
        await Swal.fire('Error al cargar Cheque', 'El importe es obligatorio', 'error');
        return false;
    }
    if (!f_cheque) {
        await Swal.fire('Error al cargar Cheque', 'La fecha del cheque es Obligatoria', 'error');
        return false;
    }
    if (!ent_por) {
        await Swal.fire('Error al cargar Cheque', 'Quien lo entrego es obligatorio', 'error');
        return false;
    }

};
