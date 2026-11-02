import dome from "@/assets/St_Pauls_Dome.jpg.asset.json";
import ghost from "@/assets/Ghostly_Figure.jpg.asset.json";
import mansion from "@/assets/Guide_Mansion_House.jpg.asset.json";
import stephen from "@/assets/Guide_Stephen_Row.jpg.asset.json";

export const images = { dome: dome.url, ghost: ghost.url, mansion: mansion.url, stephen: stephen.url };

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
    start: "Paternoster Square",
    end: "Leadenhall Market",
    duration: "90 minutes",
    image: ghost.url,
    highlights: [
      "Begin beneath the dome of St Paul's in Paternoster Square",
      "Stand at the site of Scrooge's counting house",
      "Visit the place Dickens imagined as Scrooge's London residence",
      "Hear the true stories of Victorian London that inspired the book",
      "Finish among the Victorian arcades of Leadenhall Market",
    ],
  },
  {
    slug: "sherlock-holmes",
    title: "Sherlock Holmes",
    tagline: "Fog, footprints and the world's greatest consulting detective.",
    status: "coming",
    area: "London",
    duration: "90 minutes",
  },
  {
    slug: "royal-london",
    title: "A Royal London",
    tagline: "Crowns, coronations and palace intrigue in Westminster.",
    status: "coming",
    area: "Westminster",
    duration: "90 minutes",
  },
];

export type Post = { slug: string; title: string; date: string; month: string; excerpt: string; body: string[]; image?: string };

// Add a new post at the top of this list each month.
export const posts: Post[] = [
  {
    slug: "the-real-counting-houses",
    title: "The Real Counting Houses of Dickens' City",
    date: "2026-11-01",
    month: "November 2026",
    excerpt: "Where would a man like Ebenezer Scrooge really have kept his ledgers? A look at the cramped courts behind Cornhill.",
    image: images.stephen,
    body: [
      "When Dickens placed Scrooge's counting house in the City, his readers would have known exactly the kind of place he meant: a cramped, cold room up a narrow court, lit by a single candle and warmed by a fire so small it looked like one coal.",
      "The City of the 1840s was a maze of alleys and yards packed with clerks, merchants and moneylenders. Many of those passages survive today, hidden between glass towers — and on our tour we step into them.",
      "Next month: the story of how Christmas itself was reinvented in Victorian London.",
    ],
  },
];
