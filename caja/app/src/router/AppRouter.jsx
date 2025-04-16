import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from '../Home/pages/Home'
import { Cheques } from '../cheque/pages/Cheques'
import { Tarjetas } from '../tarjeta/pages/Tarjetas'
import { Valores } from '../valor/pages/Valores'
import { Provedor } from '../provedor/Pages/Provedor'
import { Configuracion } from '../configuracion/pages/Configuracion'
import { MovimientoCaja } from '../movimientos/pages/MovimientoCaja'

const AppRouter = () => {


    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/valores' element={<Valores />} />
            <Route path='/cheques' element={<Cheques />} />
            <Route path='/tarjetas' element={<Tarjetas />} />
            <Route path='/movimientos' element={<MovimientoCaja />} />
            <Route path='/provedores' element={<Provedor />} />
            <Route path='/configuracion' element={<Configuracion />} />
        </Routes>
    )
}

export default AppRouter