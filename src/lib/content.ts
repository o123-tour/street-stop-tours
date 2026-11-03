import dome from "@/assets/St_Pauls_Dome.jpg";
import ghost from "@/assets/Ghostly_Figure.jpg";
import mansion from "@/assets/Guide_Mansion_House.jpg";
import stephen from "@/assets/Guide_Stephen_Row.jpg";
import carolGuide from "@/assets/carol_tour_guide.jpg";
import steps from "@/assets/st_pauls_steps.jpg";

export const images = {
  dome,
  ghost,
  mansion,
  stephen,
  carolGuide,
  steps,
};

export type Tour = {
  slug: string;
  title: string;
  tagline: string;
  status: "available" | "coming";
  area: string;
  start?: string;
  end?: string;
  duration: string;
  image?: string;
  highlights?: string[];
};

export const tours: Tour[] = [
  {
    slug: "christmas-carol",
    title: "A Christmas Carol: Dickens' London",
    tagline: "Walk in Scrooge's footsteps through the gaslit City of London.",
    status: "available",
    area: "City of London",
    start: "Paternoster Square Column",
    end: "Leadenhall Market",
    duration: "90 minutes",
    image: carolGuide,
    highlights: [
      "Paternoster Square Column",
      "Saint Paul's Churchyard",
      "Bow Bells Church",
      "Groveland Court",
      "Well Court",
      "Mansion House",
      "The Royal Exchange",
      "Castle Court",
      "Simpson's Tavern",
      "Newman's Court",
      "Saint Michael Cornhill",
      "St Peter upon Cornhill Graveyard",
      "George and Vulture",
      "Brabant Court",
      "Leadenhall Market",
    ],
  },
  {
    slug: "sherlock-holmes",
    title: "Mystery, Murder and Plot: Sherlock's London",
    tagline: "Fog, footprints and the world's greatest consulting detective.",
    status: "coming",
    area: "Baker Street to St James's",
    duration: "90 minutes",
  },
  {
    slug: "royal-london",
    title: "A Royal London",
    tagline: "Crowns, coronations and palace intrigue in Westminster.",
    status: "coming",
    area: "Statue of King George V, Westminster to Buckingham Palace",
    duration: "90 minutes",
  },
];

export type Post = { slug: string; title: string; date: string; month: string; excerpt: string; body: string[]; image?: string };

// Add a new post at the top of this list each month.
export const posts: Post[] = [
  {
    slug: "history-of-st-pauls-cathedral",
    title: "Fire, Faith and a Famous Dome: The Story of St Paul's Cathedral",
    date: "2026-11-01",
    month: "November 2026",
    excerpt: "For over 1,400 years a cathedral dedicated to St Paul has stood on Ludgate Hill. Here is how London's great dome came to be.",
    image: steps,
    body: [
      "The first cathedral to St Paul on Ludgate Hill was founded in 604 AD by Mellitus, Bishop of the East Saxons. It was built of wood and burned down, and its replacements met similar fates, until the Normans began a vast stone cathedral after a fire in 1087.",
      "That building, now known as Old St Paul's, grew into one of the longest churches in Europe, with a spire taller than anything in London today bar a few modern towers. By Tudor times its nave, nicknamed 'Paul's Walk', had become a noisy meeting place for gossips, merchants and pickpockets.",
      "In September 1666 the Great Fire of London swept up Ludgate Hill. Booksellers had stored their stock in the crypt for safety, and the burning paper helped melt the lead roof, which ran down the streets like a river. Old St Paul's was left a ruin.",
      "The task of rebuilding fell to Sir Christopher Wren. After several rejected designs, work began in 1675, and the new cathedral was declared complete in 1711. Its great dome, inspired by St Peter's in Rome, is actually three domes in one: an inner dome seen from below, a hidden brick cone, and the outer dome that dominates the skyline.",
      "Wren is buried in the crypt beneath a simple slab. Its Latin inscription reads 'Lector, si monumentum requiris, circumspice': 'Reader, if you seek his monument, look around you.'",
      "During the Blitz in 1940, Winston Churchill ordered that St Paul's be saved at all costs. Volunteers of the St Paul's Watch put out fires on the roof night after night, and the famous photograph of the dome rising through the smoke became a symbol of London's survival.",
      "Dickens knew the cathedral well, and its steps are where our Christmas Carol tour begins. Join us and we'll tell you more stories from its long shadow.",
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  { q: "How much walking is involved?", a: "About 1.5 miles (2.5 km) at a gentle pace over 90 minutes, with regular stops for stories. The route is mostly flat city streets, with some narrow alleys and courtyards." },
  { q: "Is the tour accessible?", a: "Most of the route is step-free on pavements, but some old courts and alleys are narrow and have uneven paving or cobbles. Wheelchair and mobility scooter users are welcome; please contact us before booking so we can talk through the route with you. Benches are available at a few stops." },
  { q: "Where do we meet?", a: "At the column in the middle of Paternoster Square, next to St Paul's Cathedral. Please arrive 10 minutes early. Your guide will be waiting and leaves promptly at the start time." },
  { q: "Where does it finish?", a: "At Leadenhall Market, a short walk from Bank, Monument and Liverpool Street stations." },
  { q: "Does it go ahead in bad weather?", a: "Yes, rain or shine. Please dress warmly, wear comfortable shoes and bring an umbrella." },
  { q: "Is it suitable for children?", a: "Yes, children are very welcome. There are a few spooky ghost stories, so it suits ages 8 and up best." },
  { q: "Can I cancel or change my booking?", a: "Get in touch with us as soon as possible and we'll do our best to move you to another date." },
];
