const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


//settings
app.set('port', 4000);

//middlewears
app.use(cors());
app.use(express.json());

//routes
app.use('/gestion/clientes', require('./routes/cliente'));

app.use('/gestion/compensada', require('./routes/compensada'));

app.use('/gestion/cuenta', require('./routes/cuenta'));

app.use('/gestion/gastos', require('./routes/gasto'));

app.use('/gestion/historica', require('./routes/historica'));

app.use('/gestion/marca', require('./routes/marca.route'));

app.use('/gestion/movimiento', require('./routes/movProducto'));

app.use('/gestion/movRecibo', require('./routes/movRecibo'));

app.use('/gestion/movVendedores', require('./routes/movVendedores'));

app.use('/gestion/nroSerie', require('./routes/nroSerie'));

app.use('/gestion/numero', require('./routes/numero'));

app.use('/gestion/presupuesto', require('./routes/presupuesto'));

app.use('/gestion/productos', require('./routes/producto'));

app.use('/gestion/recibo', require('./routes/recibo'));

app.use('/gestion/remitos', require('./routes/remito.route'));

app.use('/gestion/rubro', require('./routes/rubro'));

app.use('/gestion/ventas', require('./routes/venta'));

app.use('/gestion/pedidos', require('./routes/pedido'));

app.use('/gestion/servicios', require('./routes/servicioTecnico.route'));

app.use('/gestion/vendedores', require('./routes/vendedor'));

//Caja
app.use('/gestion/cheques', require('./routes/cheque.routes'));
app.use('/gestion/provedores', require('./routes/provedor.routes'));
app.use('/gestion/tarjetas', require('./routes/tarjeta.routes'));
app.use('/gestion/tipoTarjeta', require('./routes/tipoTarjeta.routes'));
app.use('/gestion/valores', require('./routes/valor.route'));
app.use('/gestion/evento', require('./routes/evento.routes'));
app.use('/gestion/categoriaEvento', require('./routes/categoryEvento.routes'));

module.exports = app;