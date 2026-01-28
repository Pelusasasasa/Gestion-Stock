const { fromZonedTime, formatInTimeZone } = require("date-fns-tz");
const { format } = require("date-fns");

const fechaConHoraLocal = (fechaYYYYMMDD) => {
  const timeZone = "America/Argentina/Buenos_Aires";

  // Hora actual de la computadora
  const horaActual = format(new Date(), "HH:mm:ss");

  // Fecha + hora en horario Argentina
  const fechaHoraLocal = `${fechaYYYYMMDD} ${horaActual}`;

  // Convertimos a UTC (Date real)

  return formatInTimeZone(
    fromZonedTime(fechaHoraLocal, timeZone),
    "America/Argentina/Buenos_Aires",
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  );
};

module.exports = fechaConHoraLocal;
