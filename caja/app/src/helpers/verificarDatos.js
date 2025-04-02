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
