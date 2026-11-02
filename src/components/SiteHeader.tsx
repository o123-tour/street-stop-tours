import { Link } from "@tanstack/react-router";
import { StreetSign } from "./StreetSign";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours/christmas-carol", label: "Tours" },
  { to: "/blog", label: "History Blog" },
  { to: "/book", label: "Book" },
] as const;

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" aria-label="Street Stop Tours home"><StreetSign size="sm" /></Link>
        <nav className="flex flex-wrap justify-end gap-x-5 gap-y-1 font-sign text-xs uppercase tracking-[0.2em]">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <StreetSign size="sm" />
        <p>90-minute historical walking tours · London, UK</p>
        <p>© {new Date().getFullYear()} Street Stop Tours</p>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, image }: { eyebrow: string; title: string; image: string }) {
  return (
    <section className="relative flex min-h-[55vh] items-end bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 hero-shade" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-32">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
      </div>
    </section>
  );
}
