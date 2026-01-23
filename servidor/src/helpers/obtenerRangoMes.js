const { startOfMonth, endOfMonth } = require("date-fns");

const obtenerRangoMes = (fecha) => {
  const [year, month] = fecha.split("-").map(Number);

  const baseDate = new Date(year, month - 1, 1);

  const inicio = startOfMonth(baseDate);
  const fin = endOfMonth(baseDate);

  return {
    inicio, // 2026-01-01 00:00:00
    fin, // 2026-01-31 23:59:59.999
  };
};

module.exports = obtenerRangoMes;
