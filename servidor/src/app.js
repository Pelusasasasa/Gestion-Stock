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
app.use('/gestion/clientes',require('./routes/cliente'));

app.use('/gestion/compensada',require('./routes/compensada'));

app.use('/gestion/cuenta', require('./routes/cuenta'));

app.use('/gestion/gastos',require('./routes/gasto'));

app.use('/gestion/historica',require('./routes/historica'));

app.use('/gestion/marca',require('./routes/marca.route'));

app.use('/gestion/movimiento',require('./routes/movProducto'));

app.use('/gestion/movRecibo',require('./routes/movRecibo'));

app.use('/gestion/movVendedores',require('./routes/movVendedores'));

app.use('/gestion/nroSerie', require('./routes/nroSerie'));

app.use('/gestion/numero',require('./routes/numero'));

app.use('/gestion/presupuesto',require('./routes/presupuesto'));

app.use('/gestion/productos',require('./routes/producto'));

app.use('/gestion/provedor',require('./routes/provedor'));

app.use('/gestion/recibo',require('./routes/recibo'));

app.use('/gestion/remitos',require('./routes/remito.route'));

app.use('/gestion/rubro',require('./routes/rubro'));

app.use('/gestion/ventas',require('./routes/venta'));

app.use('/gestion/pedidos',require('./routes/pedido'));

app.use('/gestion/servicios',require('./routes/servicioTecnico'));

app.use('/gestion/vendedores',require('./routes/vendedor'));

module.exports = app;