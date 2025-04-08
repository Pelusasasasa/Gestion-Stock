import { useDispatch, useSelector } from "react-redux";
import { deleteProvedor, postProvedor, setMensageError, setProvedores } from "../store/provedor/provedorSlice";
import gestorApi from "../api/gestionApi";

export const useProvedorStore = () => {

    const { provedores, provedorActive, provedorIsSaving } = useSelector(state => state.provedor);
    const dispatch = useDispatch();

    //Todo Activo

    const startDeleteProvedor = async(id) => {
        const { data } = await gestorApi.delete(`/provedores/forId/${id}`);

        if(data.ok){
            dispatch(deleteProvedor(data.deleteProvedor));
        }else{
            dispatch(setMensageError(data.msg))
        }
    };

    const startGetAll = async() => {
        const { data } = await gestorApi.get('/provedores');

        dispatch(setProvedores(data.provedores));
    };

    const startPostOne = async(provedor) => {

        const { data } = await gestorApi.post('/provedores', provedor);

        if (data.ok) {
            dispatch(postProvedor(data.provedor))
        }else{
            dispatch(setMensageError(data.msg))
        }

    };

    const startPatchOne = async(provedor) => {
        const { data } = await gestorApi.patch(`/provedores/forId/${provedor._id}`, provedor);

        if (data.ok) {
            dispatch(postProvedor(data.updateProvedor))
        }else{
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
        startPostOne,
        startPatchOne
    };
}
