const konohagakure = {
  nombre: "Konohagakure no Sato",
  descripcion:
    "La Aldea Oculta entre las Hojas es una de las cinco grandes naciones shinobi. Famosa por su fuerza militar, historia legendaria y por ser cuna de muchos clanes poderosos.",
  ubicacion: "País del Fuego",
  clanes: [
    {
      nombre: "Uzumaki",
      descripcion:
        "Clan conocido por su vitalidad, longevidad y dominio del Fūinjutsu. Son reconocidos por su característico cabello rojo y grandes reservas de chakra.",
      especializaciones: ["Sellador", "Luchador", "Amistoso"],
      afinidadChakra: ["Fuego", "Agua"],
      restricciones: [],
    },
    {
      nombre: "Uchiha",
      descripcion:
        "Clan legendario portador del Sharingan. Se caracterizan por su poder ofensivo y habilidades visuales, aunque también por sus intensas emociones.",
      especializaciones: ["Rastreador", "Interrogación", "Sensorial"],
      afinidadChakra: ["Fuego", "Rayo"],
      restricciones: ["Solo 1 Uchiha por familia RP"],
    },
    {
      nombre: "Hyuga",
      descripcion:
        "Portadores del Byakugan, este clan es experto en el combate cuerpo a cuerpo con el estilo del Puño Suave, centrado en bloquear el flujo de chakra del oponente.",
      especializaciones: ["Rastreador", "Infiltración"],
      afinidadChakra: ["Viento", "Fuego"],
      restricciones: [],
    },
    {
      nombre: "Lee",
      descripcion:
        "No utilizan ninjutsu ni genjutsu, pero sobresalen por su increíble taijutsu, velocidad y determinación. Representan el poder del trabajo duro.",
      especializaciones: ["Luchador"],
      afinidadChakra: [],
      restricciones: ["No puede usar ninjutsu/genjutsu"],
    },
  ],
};

export default konohagakure;
