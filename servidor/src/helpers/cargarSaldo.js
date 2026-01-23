const cargarSaldo = (saldo, movimientos) => {
  let saldoActual = saldo.saldo ?? 0;

  return movimientos.map((movimiento) => {
    const monto = movimiento.importe;

    saldoActual =
      movimiento.tipo.tipo === "I" ? saldoActual + monto : saldoActual - monto;

    return {
      ...movimiento.toObject(),
      saldo: saldoActual,
    };
  });
};

module.exports = cargarSaldo;
