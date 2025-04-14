import { useDispatch, useSelector } from "react-redux";
import { postCategoriaEvento, savingCategoriaEvento, setCategorias } from "../store/categoriaEvento/categoriaEventoSlice";
import gestorApi from "../api/gestionApi";

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

    const startPostCategory = async (category) => {
        const api = await gestorApi();

        const { data } = await api.post('/categoriaEvento', category);

        dispatch(postCategoriaEvento(data.category));
    };

    return {
        //Atributos
        categoriaEventos,
        categoriaEventosActive,
        isSavingCategoriaEvento,

        //Metodos
        getAllCategories,
        startIsSaving,
        startPostCategory
    }

};