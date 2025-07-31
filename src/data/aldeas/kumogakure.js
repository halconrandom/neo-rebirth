const kumogakure = {
  nombre: "Kumogakure",
  descripcion:
    "La Aldea Oculta entre las Nubes es conocida por su poderío militar, sus técnicas basadas en rayos y su enfoque directo y fuerte en el combate. Es una aldea orgullosa con ninjas resistentes y hábiles.",
  clanes: [
    {
      nombre: "Yotsuki",
      descripcion:
        "El clan Yotsuki es conocido por su poder físico, velocidad y técnicas de Raiton. Muchos de sus miembros han sido figuras clave en el ejército de Kumogakure.",
      especializaciones: ["Fugaz", "Luchador"],
      afinidadChakra: ["Rayo"],
      restricciones: [],
    },
    {
      nombre: "Menashi",
      descripcion:
        "Clan sigiloso y versátil. Especializados en rastreo y operaciones encubiertas. Muchos Menashi han servido como ANBU o espías.",
      especializaciones: ["Infiltración", "Rastreador", "Sensorial", "Fugaz"],
      afinidadChakra: ["Viento", "Agua"],
      restricciones: [],
    },
    {
      nombre: "Unami",
      descripcion:
        "Conocidos por su control sobre la medicina y el Ninjutsu curativo. Son pilares en el equipo médico de Kumogakure.",
      especializaciones: ["Medico", "Amistoso"],
      afinidadChakra: ["Agua"],
      restricciones: ["Debe elegir la especialización Médica"],
    },
  ],
};

export default kumogakure;
