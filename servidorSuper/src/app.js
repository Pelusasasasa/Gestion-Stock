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
app.use('/morel/productos',require('./routes/producto'));
app.use('/morel/clientes',require('./routes/cliente'));
app.use('/morel/ventas',require('./routes/venta'));
app.use('/morel/movimiento',require('./routes/movProducto'));
app.use('/morel/compensada',require('./routes/compensada'));
app.use('/morel/historica',require('./routes/historica'));
app.use('/morel/recibo',require('./routes/recibo'));
app.use('/morel/numero',require('./routes/numero'));
app.use('/morel/rubro',require('./routes/rubro'));
app.use('/morel/gastos',require('./routes/gasto'));
app.use('/morel/pedidos',require('./routes/pedido'));


module.exports = app;