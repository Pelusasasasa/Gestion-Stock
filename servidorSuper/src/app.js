const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

//settings
app.set('port',4000);

//middlewears
app.use(cors());
app.use(express.json());

//routes
app.use('/gestion/productos',require('./routes/producto'));
app.use('/gestion/clientes',require('./routes/cliente'));
app.use('/gestion/ventas',require('./routes/venta'));
app.use('/gestion/recibo',require('./routes/recibo'));
app.use('/gestion/remitos',require('./routes/remito'));
app.use('/gestion/movimiento',require('./routes/movProducto'));
app.use('/gestion/compensada',require('./routes/compensada'));
app.use('/gestion/historica',require('./routes/historica'));
app.use('/gestion/numero',require('./routes/numero'));
app.use('/gestion/rubro',require('./routes/rubro'));
app.use('/gestion/gastos',require('./routes/gasto'));
app.use('/gestion/pedidos',require('./routes/pedido'));
app.use('/gestion/servicios',require('./routes/servicio'));

module.exports = app;