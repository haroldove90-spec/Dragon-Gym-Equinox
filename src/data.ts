import { GymClass, Program, Article, UserProfile } from './types';

export const mockUserProfile: UserProfile = {
  name: "Molly",
  avatarLetter: "M",
  checkInCount: 2,
  checkInGoal: 3,
  membershipLevel: "Destination Access",
  favoriteClub: "Dragon Gym Hudson Yards"
};

export const mockArticles: Article[] = [
  {
    id: "art-1",
    title: "Elevate your game with new styles",
    category: "SHOP",
    subtitle: "From Vuori, Rhone, ASRV, Lululemon and more.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop",
    content: "Discover the newest performance apparel designed to move with you. Dragon Gym curated shops offer exclusive pieces crafted for peak performance, extreme comfort, and effortless transition from sweat to street. Visit the Shop in-club or online to explore the latest drops.",
    readTime: "3 min read"
  },
  {
    id: "art-2",
    title: "Cabanas Now Open",
    category: "BENEFIT",
    subtitle: "Stop by Hudson Yards for sunset views and recovery.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
    content: "Our outdoor roof terrace and cabanas are officially open for the season. Relax after an intense workout with custom wellness juices, dynamic compression boots, or enjoy a panoramic sunset view over the Hudson River. Reserved exclusively for Dragon Gym Members.",
    readTime: "5 min read"
  },
  {
    id: "art-3",
    title: "The Science of Cold Plunge Recovery",
    category: "LIFE",
    subtitle: "How cold exposure triggers dopamine and limits soreness.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop",
    content: "Cryotherapy and cold plunge systems have become staples of the professional athlete's routine. Research shows that dynamic cold water immersion activates immediate vasoconstriction, washing away lactic acid and accelerating systemic nervous system recovery.",
    readTime: "4 min read"
  }
];

export const mockClasses: GymClass[] = [
  {
    id: "class-1",
    title: "Circuit Breaker",
    category: "HIIT",
    instructor: "Adrianne G.",
    location: "Studio 1, Hudson Yards",
    duration: 45,
    time: "10:30 AM",
    date: "Today",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    description: "Push yourself further with this cardio-charged circuit class as you take on solo and team intervals. Featuring challenging equipment for a full-body workout. A Dragon Gym Exclusive designed to break plates and exceed expectations.",
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
    title: "MetCon3",
    category: "Strength",
    instructor: "Kaisa K.",
    location: "Main Floor, Flatiron",
    duration: 50,
    time: "12:15 PM",
    date: "Today",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    description: "A high-octane metabolic conditioning class utilizing ten exercises in three intense blocks. MetCon3 challenges your anaerobic threshold and builds lean functional muscle while keeping your heart rate pegged.",
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
    title: "Vinyasa Yoga Flow",
    category: "Yoga",
    instructor: "Elena B.",
    location: "Mind Body Studio, Hudson Yards",
    duration: 60,
    time: "08:30 AM",
    date: "Tomorrow",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    description: "Connect breath and dynamic movement in a carefully flowing sequence. Expect core engagement, mindful stretching, and an extended ambient sound bath finish to balance high-intensity athletic training.",
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
    title: "Precision Run (PR)",
    category: "Running",
    instructor: "Oliver R.",
    location: "Treadmill Zone, Hudson Yards",
    duration: 45,
    time: "07:00 AM",
    date: "Today",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
    description: "A customized treadmill training interval class designed to optimize strike pattern, VO2 max, and running speed. Uses the custom Woodway curved treadmills for low impact and massive power output.",
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
    title: "Anthem Ride",
    category: "Cycling",
    instructor: "Trey M.",
    location: "Cycling Theater, Soho",
    duration: 45,
    time: "06:15 PM",
    date: "Tomorrow",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    description: "A rhythmic cycling session centered around deep beats and high resistance climbs. Connect with the energy of the room inside our light-controlled acoustic dome for an intense physical release.",
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
    title: "Dragon Gym Regenerate",
    subtitle: "Reach your goals with a complimentary, personalized custom program.",
    startDate: "Aug 08",
    endDate: "Sep 07",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sessions: [
      {
        id: "sess-1",
        title: "Cable Hip Abduction",
        type: "Full Body Strength",
        duration: 25,
        movesCount: 4,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "Cable Standing Hip Abduction",
            reps: "12 reps",
            sets: 3,
            description: "Attach low cable to outer ankle. Stand tall holding the upright, brace your core, and abduct leg to side slowly."
          },
          {
            name: "Kettlebell Romanian Deadlift",
            reps: "10 reps",
            sets: 4,
            description: "Keep feet hip-width apart. Hinge back at your hips, keeping a flat back, and squeeze glutes to return."
          },
          {
            name: "Dumbbell Renegade Row",
            reps: "8 reps/side",
            sets: 3,
            description: "Start in pushup position on hex dumbbells. Row one dumbbell to hip pocket without rotating pelvis."
          },
          {
            name: "Stability Ball Stir-the-Pot",
            reps: "30 seconds",
            sets: 3,
            description: "In a forearm plank on stability ball, draw small circles with your elbows while maintaining spine position."
          }
        ]
      },
      {
        id: "sess-2",
        title: "Mobility & Flow Restore",
        type: "Dynamic Flexibility",
        duration: 20,
        movesCount: 3,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "World's Greatest Stretch",
            reps: "5 reps/side",
            sets: 3,
            description: "Deep lunge with back knee up, rotate elbow down inside ankle, then open arm up towards the sky."
          },
          {
            name: "90/90 Hip Swivels",
            reps: "8 reps/side",
            sets: 3,
            description: "Sit on floor with knees bent at 90 degrees in front and side. Swivel hips side-to-side dynamically."
          },
          {
            name: "Thoracic Foam Roller Extension",
            reps: "10 gentle extensions",
            sets: 3,
            description: "Support your neck and arch midback over foam roller while keeping hips on the ground."
          }
        ]
      },
      {
        id: "sess-3",
        title: "Aerobic Capacity Burn",
        type: "HIIT Endurance",
        duration: 35,
        movesCount: 3,
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop",
        moves: [
          {
            name: "Air Assault Bike Sprints",
            reps: "20s on / 40s rest",
            sets: 10,
            description: "Max effort sprint on air assault bike, pushing and pulling handles with max leg speed."
          },
          {
            name: "Dumbbell Goblet Squat",
            reps: "15 reps",
            sets: 4,
            description: "Hold heavy DB vertically at chest, sit deep past parallel, push through heels to stand."
          },
          {
            name: "Hanging Leg Raises",
            reps: "10 reps",
            sets: 3,
            description: "Hang from pull-up bar, raise feet to bar keeping legs as straight as possible, controlled descent."
          }
        ]
      }
    ]
  }
];

export const exploreCategories = [
  { name: "In-Club Classes", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop", filter: "In-Club" },
  { name: "On-Demand Classes", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop", filter: "On-Demand" },
  { name: "Events", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop", filter: "Events" },
  { name: "Collections", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop", filter: "Collections" },
  { name: "Articles", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop", filter: "Articles" },
  { name: "Programs by Dragon Gym", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop", filter: "Programs" },
  { name: "Movement Library", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop", filter: "Library" },
  { name: "Studio Pilates", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop", filter: "Pilates" }
];
