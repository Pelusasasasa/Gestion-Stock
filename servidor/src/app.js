const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const backUpMongoLocal = require('./backUpMongoLocal');

//settings
app.set('port', 4000);

//middlewears
app.use(cors());
app.use(express.json());

app.get('/gestion/update', (req, res) => {
  res.sendFile(path.join(__dirname, 'caja-updates', 'latest.json'));
});

app.use('/gestion/updates', express.static(path.join(__dirname, 'caja-updates')));

//routes
app.use('/gestion/clientes', require('./routes/cliente.route'));

app.use('/gestion/compensada', require('./routes/compensada.route'));

app.use('/gestion/caja', require('./routes/caja.routes'));

app.use('/gestion/cuenta', require('./routes/cuenta'));

app.use('/gestion/datos', require('./routes/datos.route'));

app.use('/gestion/gastos', require('./routes/gasto'));

app.use('/gestion/imprimir', require('./routes/imprimir.routes'));

app.use('/gestion/historica', require('./routes/historica.route'));

app.use('/gestion/manoObra', require('./routes/manoObra.routes'));

app.use('/gestion/marca', require('./routes/marca.route'));

app.use('/gestion/movimiento', require('./routes/movProducto.route'));

app.use('/gestion/movRecibo', require('./routes/movRecibo.route'));

app.use('/gestion/movVendedores', require('./routes/movVendedores'));

app.use('/gestion/nroSerie', require('./routes/nroSerie'));

app.use('/gestion/numero', require('./routes/numero'));

app.use('/gestion/presupuesto', require('./routes/presupuesto.route'));

app.use('/gestion/productos', require('./routes/producto.route'));

app.use('/gestion/recibo', require('./routes/recibo.route'));

app.use('/gestion/remitos', require('./routes/remito.route'));

app.use('/gestion/retencion', require('./routes/retencion.routes'));

app.use('/gestion/rubro', require('./routes/rubro'));

app.use('/gestion/ventas', require('./routes/venta.router'));

app.use('/gestion/pedidos', require('./routes/pedido'));

app.use('/gestion/servicios', require('./routes/servicioTecnico.route'));

app.use('/gestion/vendedores', require('./routes/vendedor.route'));

//Caja
app.use('/gestion/categoriaEvento', require('./routes/categoryEvento.routes'));
app.use('/gestion/cheques', require('./routes/cheque.routes'));
app.use('/gestion/evento', require('./routes/evento.routes'));
app.use('/gestion/movCaja', require('./routes/movCaja.routes'));

app.use('/gestion/provedores', require('./routes/provedor.routes'));
app.use('/gestion/facturaProvedores', require('./routes/facturaProvedores.route'));
app.use('/gestion/cuentaCorrienteProvedor', require('./routes/cuentaCorrienteProvedores.routes'));
app.use('/gestion/pagoProvedor', require('./routes/pagoProvedor.routes'));

app.use('/gestion/saldoMensual', require('./routes/saldoMensual.routes'));
app.use('/gestion/tarjetas', require('./routes/tarjeta.routes'));
app.use('/gestion/tipoCuenta', require('./routes/tipoCuenta.routes'));
app.use('/gestion/tipoTarjeta', require('./routes/tipoTarjeta.routes'));
app.use('/gestion/valores', require('./routes/valor.route'));

setInterval(
  () => {
    console.log('Backup de la base de datos en proceso...');
    backUpMongoLocal();
  },
  1000 * 60 * 60,
);

module.exports = app;
