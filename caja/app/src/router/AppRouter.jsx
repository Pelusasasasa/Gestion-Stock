import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home } from '../Home/pages/Home'
import { Cheques } from '../cheque/pages/Cheques'
import { Tarjetas } from '../tarjeta/pages/Tarjetas'
import { Valores } from '../valor/pages/Valores'
import { Provedor } from '../provedor/Pages/Provedor'
import { useDispatch } from 'react-redux'
import { emptyValores } from '../store/vendedor/vendedorSlice'
import { emptyStateValor } from '../store/valor/valorSlice'

const AppRouter = () => {
    //Cada vez que se cambia la ruta, ponemos en blanco los vendedores
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(emptyValores());
        dispatch(emptyStateValor()); //Ponemos por defecto los valores
    }, [location.pathname]); // Dependencia del path

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/valores' element={<Valores />} />
            <Route path='/cheques' element={<Cheques />} />
            <Route path='/tarjetas' element={<Tarjetas />} />
            <Route path='/provedores' element={<Provedor />} />
        </Routes>
    )
}

export default AppRouter