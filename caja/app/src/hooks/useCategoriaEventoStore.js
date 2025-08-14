import { useDispatch, useSelector } from "react-redux";
import { deleteCategoria, patchCategoriaEvento, postCategoriaEvento, savingCategoriaEvento, setCategorias } from "../store/categoriaEvento/categoriaEventoSlice";
import gestorApi from "../api/gestionApi";
import Swal from "sweetalert2";

export const useCategoriaEventoStore = () => {

    const { categoriaEventos, categoriaEventosActive, isSavingCategoriaEvento } = useSelector(state => state.categoriaEvento)
    const dispatch = useDispatch();

    const startIsSaving = () => {
        dispatch(savingCategoriaEvento)
    };

    const getAllCategories = async () => {
        const api = await gestorApi();

        const { data } = await api.get('/categoriaEvento');

        dispatch(setCategorias(data.categoriaEventos));

    };

    const startDeleteCategory = async (id) => {
        const api = await gestorApi();

        try {
            const { data } = await api.delete(`categoriaEvento/${id}`);

            dispatch(deleteCategoria(data.deleteCategory._id))
        } catch (error) {
            console.log(error);
            await Swal.fire('No se pudo eliminar la tipo de evento', '', 'error');
        }
    }

    const startPostCategory = async (category) => {
        const api = await gestorApi();

        const { data } = await api.post('/categoriaEvento', category);

        dispatch(postCategoriaEvento(data.category));
    };

    const startPatchCategory = async (category) => {
        const api = await gestorApi();


        try {
            const { data } = await api.patch(`categoriaEvento/${category._id}`, category);
            dispatch(patchCategoriaEvento(data.updateCategoria));
        } catch (error) {
            console.log(error);
            await Swal.fire('No se pudo modificar el evento', error.response.data.msg, 'error');
        }
    };


    return {
        //Atributos
        categoriaEventos,
        categoriaEventosActive,
        isSavingCategoriaEvento,

        //Metodos
        getAllCategories,
        startDeleteCategory,
        startIsSaving,
        startPatchCategory,
        startPostCategory
    }

};