import { GymClass, Program, Article, UserProfile } from './types';

export const mockUserProfile: UserProfile = {
  id: "DG-ATHLETE-7102",
  name: "Molly Jones",
  email: "molly.jones@dragongym.com",
  phone: "+52 (55) 3819-9921",
  bloodType: "O+",
  emergencyContact: "David Jones (Esposo) - +52 (55) 3810-0022",
  avatarLetter: "M",
  checkInCount: 2,
  checkInGoal: 3,
  membershipLevel: "Acceso Destino VIP",
  favoriteClub: "Dragon Gym Polanco"
};

export const mockArticles: Article[] = [
  {
    id: "art-1",
    title: "Eleva tu rendimiento con nuevos estilos",
    category: "SHOP",
    subtitle: "De Vuori, Rhone, ASRV, Lululemon y más.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop",
    content: "Descubre la ropa de rendimiento más nueva diseñada para moverse contigo. Las tiendas selectas de Dragon Gym ofrecen prendas exclusivas diseñadas para el máximo rendimiento, comodidad extrema y una transición sin esfuerzo del sudor a la calle. Visita la tienda en el club o en línea para explorar los últimos lanzamientos.",
    readTime: "Lectura de 3 min"
  },
  {
    id: "art-2",
    title: "Cabañas ya abiertas para relajación",
    category: "BENEFIT",
    subtitle: "Visita Polanco para disfrutar de vistas al atardecer y recuperación.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
    content: "Nuestra terraza al aire libre y cabañas están oficialmente abiertas para la temporada. Relájate después de un entrenamiento intenso con jugos de bienestar personalizados, botas de compresión dinámica o disfruta de una vista panorámica del atardecer sobre el río. Reservado exclusivamente para socios de Dragon Gym.",
    readTime: "Lectura de 5 min"
  },
  {
    id: "art-3",
    title: "La ciencia de la recuperación con inmersión en frío",
    category: "LIFE",
    subtitle: "Cómo la exposición al frío desencadena dopamina y reduce el dolor muscular.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop",
    content: "La crioterapia y los sistemas de inmersión en frío se han convertido en elementos básicos de la rutina de los atletas profesionales. Las investigaciones demuestran que la inmersión dinámica en agua fría activa una vasoconstricción inmediata, eliminando el ácido láctico y acelerando la recuperación del sistema nervioso sistémico.",
    readTime: "Lectura de 4 min"
  }
];

export const mockClasses: GymClass[] = [
  {
    id: "class-1",
    title: "Rompe Circuitos (Circuit Breaker)",
    category: "HIIT",
    instructor: "Adrianne G.",
    location: "Estudio 1, Polanco",
    duration: 45,
    time: "10:30 AM",
    date: "Hoy",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    description: "Exígete más en esta clase de circuito cargada de cardio mientras realizas intervalos individuales y en equipo. Cuenta con equipo desafiante para un entrenamiento de cuerpo completo. Una exclusividad de Dragon Gym diseñada para romper récords y superar expectativas.",
    breakdown: {
      strength: 4,
      cardio: 5,
      athleticism: 5
    },
    booked: false,
    isEquinoxExclusive: true
  },
  {
    id: "class-2",
    title: "Acondicionamiento Metabólico 3 (MetCon3)",
    category: "Strength",
    instructor: "Kaisa K.",
    location: "Piso Principal, Roma Norte",
    duration: 50,
    time: "12:15 PM",
    date: "Hoy",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    description: "Una clase de acondicionamiento metabólico de alto octanaje que utiliza diez ejercicios en tres bloques intensos. MetCon3 desafía tu umbral anaeróbico y desarrolla músculo funcional magro mientras mantiene tu ritmo cardíaco al máximo.",
    breakdown: {
      strength: 5,
      cardio: 4,
      athleticism: 4
    },
    booked: false,
    isEquinoxExclusive: true
  },
  {
    id: "class-3",
    title: "Flexibilidad y Fuerza Funcional",
    category: "Funcional",
    instructor: "Elena B.",
    location: "Estudio Mente y Cuerpo, Polanco",
    duration: 60,
    time: "08:30 AM",
    date: "Mañana",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    description: "Conecta la respiración y el movimiento dinámico en una secuencia de acondicionamiento físico cuidadosamente fluida. Espera un trabajo activo de core, estiramientos conscientes y un final de baño de sonido ambiental para equilibrar el entrenamiento de alta intensidad.",
    breakdown: {
      strength: 3,
      cardio: 2,
      athleticism: 4
    },
    booked: false,
    isEquinoxExclusive: false
  },
  {
    id: "class-4",
    title: "Carrera de Precisión (Precision Run)",
    category: "Running",
    instructor: "Oliver R.",
    location: "Zona de Caminadoras, Polanco",
    duration: 45,
    time: "07:00 AM",
    date: "Hoy",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
    description: "Una clase de intervalos de entrenamiento en caminadora personalizada diseñada para optimizar el patrón de pisada, el VO2 máx. y la velocidad de carrera. Utiliza caminadoras curvas Woodway personalizadas para un bajo impacto y un gran rendimiento de potencia.",
    breakdown: {
      strength: 2,
      cardio: 5,
      athleticism: 4
    },
    booked: false,
    isEquinoxExclusive: true
  },
  {
    id: "class-5",
    title: "Rodada Anthem (Anthem Ride)",
    category: "Cycling",
    instructor: "Trey M.",
    location: "Teatro de Ciclismo, Santa Fe",
    duration: 45,
    time: "06:15 PM",
    date: "Mañana",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    description: "Una sesión de ciclismo rítmico centrada en ritmos profundos y subidas de alta resistencia. Conéctate con la energía de la sala dentro de nuestro domo acústico con control de luz para una liberación física intensa.",
    breakdown: {
      strength: 3,
      cardio: 5,
      athleticism: 4
    },
    booked: false,
    isEquinoxExclusive: true
  }
];

export const mockPrograms: Program[] = [
  {
    id: "prog-1",
    title: "Regeneración Dragon Gym",
    subtitle: "Alcanza tus metas con un programa de cortesía personalizado.",
    startDate: "08 Ago",
    endDate: "07 Sep",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sessions: [
      {
        id: "sess-1",
        title: "Abducción de Cadera en Polea",
        type: "Fuerza de Cuerpo Completo",
        duration: 25,
        movesCount: 4,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "Abducción de Cadera de Pie en Polea",
            reps: "12 reps",
            sets: 3,
            description: "Sujeta la polea baja al tobillo externo. Párate derecho sosteniendo el soporte, activa el abdomen y abduce la pierna hacia el lado lentamente."
          },
          {
            name: "Peso Muerto Rumano con Pesa Rusa",
            reps: "10 reps",
            sets: 4,
            description: "Mantén los pies a la anchura de las caderas. Haz una bisagra hacia atrás con las caderas, manteniendo la espalda recta, y aprieta los glúteos al regresar."
          },
          {
            name: "Remo Renegado con Mancuernas",
            reps: "8 reps por lado",
            sets: 3,
            description: "Comienza en posición de lagartija sobre mancuernas hexagonales. Lleva una mancuerna a la cadera sin rotar la pelvis."
          },
          {
            name: "Plancha Dinámica en Pelota de Estabilidad",
            reps: "30 segundos",
            sets: 3,
            description: "En plancha sobre antebrazos en pelota de estabilidad, dibuja pequeños círculos con los codos mientras mantienes la posición de la columna."
          }
        ]
      },
      {
        id: "sess-2",
        title: "Restauración de Movilidad y Flujo",
        type: "Flexibilidad Dinámica",
        duration: 20,
        movesCount: 3,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "El Mejor Estiramiento del Mundo",
            reps: "5 reps por lado",
            sets: 3,
            description: "Desplante profundo con la rodilla de atrás levantada, gira el codo hacia abajo por dentro del tobillo, luego abre el brazo hacia el cielo."
          },
          {
            name: "Giro de Caderas 90/90",
            reps: "8 reps por lado",
            sets: 3,
            description: "Siéntate en el suelo con las rodillas dobladas a 90 grados al frente y de lado. Gira las caderas de lado a lado dinámicamente."
          },
          {
            name: "Extensión Torácica con Rodillo de Espuma",
            reps: "10 extensiones suaves",
            sets: 3,
            description: "Sostén tu cuello y arquea la espalda media sobre el rodillo de espuma mientras mantienes las caderas en el suelo."
          }
        ]
      },
      {
        id: "sess-3",
        title: "Quema de Capacidad Aeróbica",
        type: "Resistencia HIIT",
        duration: 35,
        movesCount: 3,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "Sprints en Bicicleta de Aire Assault",
            reps: "20s activo / 40s descanso",
            sets: 10,
            description: "Sprint de máximo esfuerzo en bicicleta de aire, empujando y jalando los manubrios con la máxima velocidad de piernas."
          },
          {
            name: "Sentadilla Goblet con Mancuerna",
            reps: "15 reps",
            sets: 4,
            description: "Sostiene una mancuerna pesada verticalmente en el pecho, baja profundamente pasando el paralelo, empuja con los talones para ponerte de pie."
          },
          {
            name: "Elevaciones de Piernas Colgado",
            reps: "10 reps",
            sets: 3,
            description: "Cuélgate de la barra de dominadas, eleva los pies hacia la barra manteniendo las piernas lo más rectas posible, descenso controlado."
          }
        ]
      }
    ]
  }
];

export const exploreCategories = [
  { name: "Clases en el Club", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop", filter: "In-Club" },
  { name: "Clases On-Demand", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop", filter: "On-Demand" },
  { name: "Eventos", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop", filter: "Events" },
  { name: "Colecciones", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop", filter: "Collections" },
  { name: "Artículos", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop", filter: "Articles" },
  { name: "Programas Dragon Gym", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop", filter: "Programs" },
  { name: "Biblioteca de Movimientos", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop", filter: "Library" },
  { name: "Estudio de Pilates", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop", filter: "Pilates" }
];
