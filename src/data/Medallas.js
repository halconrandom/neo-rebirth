// src/data/Medallas.js

// Importación de imágenes estáticas
import founderMedal from "../assets/founderMedal.png";
import adminMedal from "../assets/adminMedal.png";


const Medallas = [
  // Participación
  {
    nombre: "Participante Activo",
    descripcion: "Ha publicado en el foro al menos 10 veces.",
    tipo: "automatico",
    criterio: (usuario) => usuario.totalPosts >= 10,
  },
  {
    nombre: "Veterano del Foro",
    descripcion: "Ha estado registrado por más de 6 meses.",
    tipo: "automatico",
    criterio: (usuario) => {
      const seisMeses = 1000 * 60 * 60 * 24 * 30 * 6;
      return Date.now() - new Date(usuario.creado).getTime() >= seisMeses;
    },
  },

  // Rol
  {
    nombre: "Primer Rol Completado",
    descripcion: "Ha terminado su primer rol.",
    tipo: "manual",
  },
  {
    nombre: "Creador de Tramas",
    descripcion: "Ha creado una historia o evento propio para otros usuarios.",
    tipo: "manual",
  },

  // Perfil
  {
    nombre: "Perfil Completo",
    descripcion:
      "Ha completado todos los campos de su perfil incluyendo avatar y redes sociales.",
    tipo: "automatico",
    criterio: (usuario) =>
      usuario.avatar && usuario.bio && usuario.social?.length > 0,
  },

  // Economía / Interacción
  {
    nombre: "Rico",
    descripcion: "Ha acumulado más de 10.000 ryus.",
    tipo: "automatico",
    criterio: (usuario) => usuario.ryus >= 10000,
  },
  {
    nombre: "Buen Compañero",
    descripcion: "Ha dado más de 20 comentarios a otras fichas.",
    tipo: "automatico",
    criterio: (usuario) => usuario.comentariosEnFichas >= 20,
  },

  // Exclusivas / Staff
  {
    nombre: "Fundador",
    descripcion: "Miembro del equipo fundador del foro.",
    tipo: "manual",
    imagen: founderMedal,
  },
  {
    nombre: "Administrador",
    descripcion: "Es parte de la Administración del foro.",
    tipo: "manual",
    imagen: adminMedal,
  },
  {
    nombre: "Moderador",
    descripcion: "Es parte del staff del foro.",
    tipo: "manual",
  },
];

export default Medallas;
