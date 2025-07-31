import konohagakure from "./konohagakure";
import kumogakure from "./kumogakure";

// Importar más aldeas aquí en el futuro

const aldeas = [konohagakure, kumogakure];

// Esta función recibe el nombre de un clan y devuelve las especializaciones compatibles
export function getEspecializacionesPorClan(clanBuscado) {
  for (const aldea of aldeas) {
    const clan = aldea.clanes.find((c) => c.nombre.toLowerCase() === clanBuscado.toLowerCase());
    if (clan) {
      return clan.especialidades;
    }
  }
  return [];
}

// Esta función devuelve todos los clanes disponibles (por si se requiere listarlos)
export function getTodosLosClanes() {
  return aldeas.flatMap((aldea) => aldea.clanes.map((clan) => ({
    nombre: clan.nombre,
    aldea: aldea.nombre,
  })));
}
