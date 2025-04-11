import { useDispatch, useSelector } from "react-redux";
import gestorApi from "../api/gestionApi";
import { setValores } from "../store/vendedor/vendedorSlice";

export const useVendedorStore = () => {

    const { nombre, permiso } = useSelector(state => state.vendedor)
    const dispatch = useDispatch();

    const startSetValores = async (codigo) => {
        const api = await gestorApi();
        const { data } = await api.get(`vendedores/id/${codigo}`);

        dispatch(
            setValores({
                nombre: data.nombre,
                permiso: data.permiso
            })
        );

    };


    return {
        //Atributos
        nombre,
        permiso,

        //Metodos
        startSetValores
    }

};