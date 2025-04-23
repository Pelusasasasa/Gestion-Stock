import Swal from "sweetalert2";
import gestorApi from "../api/gestionApi";
import { deleteCheque, emptyCheque, emptyValues, isSaving, postCheque, setActive, setCheques, updateCheque } from "../store/cheque/chequeSlice";
import { useDispatch, useSelector } from "react-redux";

export const useChequeStore = () => {
    const dispatch = useDispatch();
    const { cheques, chequeActive, isSavingCheque } = useSelector(state => state.cheques);

    const emptyActiveCheque = () => {
        dispatch(emptyCheque())
    };

    const startGetAllCheques = async () => {
        const api = await gestorApi();
        try {
            const { data } = await api.get('cheques');
            dispatch(setCheques(data.cheques))
        } catch (error) {
            console.log(error);
        }
    };

    const startPostOne = async (cheque) => {
        cheque.importe = parseFloat(cheque.importe);

        const api = await gestorApi();
        const { data } = await api.post('/cheques', cheque);

        if (data.ok) {
            await cargarEventoAux(data.cheque);
        }

        dispatch(postCheque(data.cheque));
    };

    const startUpdateOne = async (cheque) => {
        dispatch(isSaving());
        cheque.importe = parseFloat(cheque.importe);

        const api = await gestorApi();
        const { data } = await api.patch(`/cheques/forId/${cheque._id}`, cheque);

        if (data.ok) {
            await modificarEventoAux(data.chequeUpdate)
        }

        dispatch(updateCheque(data.chequeUpdate));
    };

    const startEmptyCheques = async () => {
        dispatch(emptyValues());
    };

    const startDeleteCheque = async (id) => {
        dispatch(isSaving());

        const api = await gestorApi();
        const { data } = await api.delete(`/cheques/forId/${id}`);

        await elimiarEventoAux(data.chequeDelete)

        dispatch(deleteCheque(data.chequeDelete._id));
    };

    const startSetActiveCheque = async (id) => {
        const cheque = cheques.find(elem => elem._id === id);
        dispatch(setActive(cheque));
    };

    //Cargamos un evento con la fecha de pago del cheque
    const cargarEventoAux = async (cheque) => {
        const api = await gestorApi();

        const { data: category } = await api.get(`categoriaEvento/forName/PAGO CHEQUE`)

        const evento = {};
        evento.title = `Cheque a cobrar ${cheque.numero}`
        evento.description = cheque.ent_por;
        evento.start_date = cheque.f_cheque;
        evento.end_date = cheque.f_cheque;
        evento.relatedModel = 'cheque';
        evento.relatedId = cheque._id;

        if (category.ok) {
            evento.category = category.category._id;
        } else {
            console.log(category);
        };


        try {
            await api.post(`evento`, evento);
        } catch (error) {
            const msg = error.response.data.msg;
            Swal.fire('Error al cargar el evento', msg, 'error');
        };

    };

    const modificarEventoAux = async (cheque) => {
        const api = await gestorApi();
        const { data } = await api.get(`evento/forRelated/${cheque._id}/cheque`);

        data.evento.start_date = cheque.f_cheque;
        data.evento.end_date = cheque.f_cheque;


        try {
            await api.patch(`evento/${data.evento._id}`, data.evento);
        } catch (error) {
            console.log(error);
            await Swal.fire('No se pudo modificar el evento', error.response.data.msg, 'Error');
        }


    };

    const elimiarEventoAux = async (cheque) => {
        const api = await gestorApi();
        await api.delete(`evento/forRelated/${cheque._id}/cheque`);
    };

    return {
        //atributos
        cheques,
        chequeActive,
        isSavingCheque,

        //metodos
        emptyActiveCheque,
        startDeleteCheque,
        startEmptyCheques,
        startGetAllCheques,
        startPostOne,
        startSetActiveCheque,
        startUpdateOne
    }
};


