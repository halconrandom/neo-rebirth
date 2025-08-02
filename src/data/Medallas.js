// src/data/Medallas.js

// Importación de imágenes estáticas
import founderMedal from "../assets/founderMedal.png";
import adminMedal from "../assets/adminMedal.png";
import creadorTramas from "../assets/creadorTramas.png";
import constructorMundos from "../assets/constructorMundos.png";

const Medallas = [
  // Participación
  {
    nombre: "Participante Activo",
    descripcion: "Ha publicado en el foro al menos 10 veces.",
    tipo: "manual",
  },
  {
    nombre: "Veterano del Foro",
    descripcion: "Ha estado registrado por más de 6 meses.",
    tipo: "manual",
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
    imagen: creadorTramas,
  },
  {
    nombre: "Narrador Constante",
    descripcion: "Ha participado activamente en al menos 5 roles narrativos distintos.",
    tipo: "manual",
  },
  {
    nombre: "Rol Legendario",
    descripcion: "Ha participado en un rol épico reconocido por la comunidad.",
    tipo: "manual",
  },
  {
    nombre: "Camaleón de Personajes",
    descripcion: "Ha interpretado al menos 3 personajes diferentes.",
    tipo: "manual",
  },

  // Perfil
  {
    nombre: "Perfil Completo",
    descripcion: "Ha completado todos los campos de su perfil incluyendo avatar y redes sociales.",
    tipo: "manual",
  },
  {
    nombre: "Estrella Visual",
    descripcion: "Su ficha ha sido destacada por su diseño visual.",
    tipo: "manual",
  },

  // Economía / Interacción
  {
    nombre: "Rico",
    descripcion: "Ha acumulado más de 10.000 ryus.",
    tipo: "manual",
  },
  {
    nombre: "Buen Compañero",
    descripcion: "Ha dado más de 20 comentarios a otras fichas.",
    tipo: "manual",
  },
  {
    nombre: "Embajador Shinobi",
    descripcion: "Ha traído al menos 3 nuevos usuarios que crearon ficha y participaron en roles.",
    tipo: "manual",
  },

  // Comunidad / Staff
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
  {
    nombre: "Maestro Estratega",
    descripcion: "Ha creado una ficha destacada por su calidad narrativa y estrategia.",
    tipo: "manual",
  },
  {
    nombre: "Constructor de Mundos",
    descripcion: "Ha contribuido significativamente al lore del foro.",
    tipo: "manual",
    imagen: constructorMundos,
  },
  {
    nombre: "Defensor del Rol",
    descripcion: "Ha ayudado a resolver conflictos dentro de roles grupales.",
    tipo: "manual",
  },
  {
    nombre: "Guardián del Saber",
    descripcion: "Ha ayudado activamente a nuevos usuarios con guías o consejos.",
    tipo: "manual",
  },
  {
    nombre: "Mente Maestra",
    descripcion: "Ha creado técnicas o habilidades personalizadas aprobadas.",
    tipo: "manual",
  },
  {
    nombre: "Alquimista del Foro",
    descripcion: "Ha propuesto mejoras técnicas aceptadas por la administración.",
    tipo: "manual",
  },
  {
    nombre: "Espíritu del Rol",
    descripcion: "Ha participado activamente durante más de 6 meses en roles.",
    tipo: "manual",
  },
  {
    nombre: "Voz del Pueblo",
    descripcion: "Ha participado activamente en debates y encuestas del foro.",
    tipo: "manual",
  },
];

export default Medallas;
