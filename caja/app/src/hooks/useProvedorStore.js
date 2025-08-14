import { useDispatch, useSelector } from "react-redux";
import { deleteProvedor, isSaving, postProvedor, putValor, setMensageError, setProvedorActive, setProvedores } from "../store/provedor/provedorSlice";
import gestorApi from "../api/gestionApi";

export const useProvedorStore = () => {

    const { provedores, provedorActive, provedorIsSaving } = useSelector(state => state.provedor);
    const dispatch = useDispatch();

    const startSetActive = async (id) => {
        dispatch(isSaving());

        const provedor = provedores.find(elem => elem._id === id);

        dispatch(setProvedorActive(provedor));
    }

    const startDeleteProvedor = async (id) => {
        const api = await gestorApi();
        const { data } = await api.delete(`/provedores/forId/${id}`);
        if (data.ok) {
            dispatch(deleteProvedor(data.provedorDelete._id));
        } else {
            dispatch(setMensageError(data.msg))
        }
    };

    const startGetAll = async () => {
        const api = await gestorApi();
        const { data } = await api.get('/provedores');
        console.log(data);

        data.provedores.sort((a, b) => {
            if (a.nombre > b.nombre) return 1;
            if (a.nombre < b.nombre) return -1;
            return 0
        })

        dispatch(setProvedores(data.provedores));
    };

    const startPostOne = async (provedor) => {
        const api = await gestorApi();
        const { data } = await api.post('/provedores', provedor);

        if (data.ok) {
            dispatch(postProvedor(data.provedor))
        } else {
            dispatch(setMensageError(data.msg))
        }

    };

    const startPatchOne = async (provedor) => {
        const api = await gestorApi();

        const { data } = await api.patch(`/provedores/forId/${provedor._id}`, provedor);
        if (data.ok) {
            dispatch(putValor(data.updateProvedor))
        } else {
            dispatch(setMensageError(data.msg))
        }
    };

    return {
        //Propiedades
        provedores,
        provedorActive,
        provedorIsSaving,

        //Metodos
        startDeleteProvedor,
        startGetAll,
        startPatchOne,
        startPostOne,
        startSetActive,
    };
}
