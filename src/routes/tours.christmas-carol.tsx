import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/SiteHeader";
import { images, tours } from "@/lib/content";

const tour = tours[0];

export const Route = createFileRoute("/tours/christmas-carol")({
  head: () => ({
    meta: [
      { title: "A Christmas Carol: Dickens' London Walking Tour | Street Stop Tours" },
      { name: "description", content: "A 90-minute walk from Paternoster Square to Leadenhall Market, visiting the sites of Scrooge's counting house and home." },
      { property: "og:title", content: "A Christmas Carol: Dickens' London Walking Tour" },
      { property: "og:description", content: "A 90-minute walk from Paternoster Square to Leadenhall Market in Scrooge's footsteps." },
    ],
  }),
  component: TourPage,
});

function TourPage() {
  return (
    <>
      <PageHero eyebrow="Walking tour · 90 minutes" title={tour.title} image={images.ghost} />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="font-display text-2xl italic leading-relaxed">{tour.tagline}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            "Marley was dead, to begin with." So begins the most famous ghost story ever told, and so begins
            our walk. Starting in the shadow of St Paul's, we wind through the old City of London to the very
            streets Dickens had in mind for Ebenezer Scrooge.
          </p>
          <h2 className="mt-12 text-2xl font-semibold">On the route</h2>
          <ul className="mt-5 space-y-3">
            {tour.highlights!.map((h) => (
              <li key={h} className="flex gap-3 text-muted-foreground"><span className="text-primary">✦</span>{h}</li>
            ))}
          </ul>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <img src={images.stephen} alt="Guide telling stories on the tour" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
            <img src={images.mansion} alt="Tour stop near Mansion House" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
          </div>
        </div>
        <aside className="h-fit rounded border border-border bg-card p-6 md:sticky md:top-6">
          <dl className="space-y-4 text-sm">
            <div><dt className="eyebrow">Starts</dt><dd className="mt-1 text-base">{tour.start}</dd></div>
            <div><dt className="eyebrow">Ends</dt><dd className="mt-1 text-base">{tour.end}</dd></div>
            <div><dt className="eyebrow">Duration</dt><dd className="mt-1 text-base">{tour.duration}</dd></div>
          </dl>
          <Link to="/book" className="mt-6 block rounded bg-primary px-6 py-3 text-center font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">Book this tour</Link>
        </aside>
      </section>
    </>
  );
}
