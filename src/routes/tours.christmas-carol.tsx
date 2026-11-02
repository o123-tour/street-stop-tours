import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/SiteHeader";
import { faqs, images, tours } from "@/lib/content";
import { PRICE_PER_PERSON_GBP } from "@/lib/schedule";

const tour = tours[0]!;
// Paternoster Square Column
const LAT = 51.51468;
const LNG = -0.09953;

export const Route = createFileRoute("/tours/christmas-carol")({
  head: () => ({
    meta: [
      { title: "A Christmas Carol: Dickens' London Walking Tour | Street Stop Tours" },
      { name: "description", content: "A 90-minute walk from Paternoster Square to Leadenhall Market, visiting the sites of Scrooge's counting house and home." },
      { property: "og:title", content: "A Christmas Carol: Dickens' London Walking Tour" },
      { property: "og:description", content: "A 90-minute walk from Paternoster Square to Leadenhall Market in Scrooge's footsteps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
            streets Dickens had in mind for Ebenezer Scrooge, including the sites of his counting house and London residence.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <img src={images.carolGuide} alt="Costumed guide with a lantern at the George and Vulture" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
            <img src={images.stephen} alt="Guide telling stories on the tour" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
            <img src={images.mansion} alt="Tour stop near Mansion House" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
          </div>

          <h2 className="mt-12 text-2xl font-semibold">The route</h2>
          <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {tour.highlights!.map((h, i) => (
              <li key={h} className="flex gap-3 text-muted-foreground">
                <span className="w-6 shrink-0 font-sign text-primary">{i + 1}.</span>{h}
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-2xl font-semibold">Meeting point</h2>
          <p className="mt-3 text-muted-foreground">
            Meet at the <strong className="text-foreground">column in Paternoster Square</strong>, beside St Paul's Cathedral.
            Please arrive <strong className="text-foreground">10 minutes early</strong>: your guide will be waiting for you and will leave promptly at the start time.
          </p>
          <div className="mt-5 overflow-hidden rounded border border-border">
            <iframe
              title="Map of Paternoster Square Column"
              className="h-80 w-full"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.004}%2C${LAT - 0.0022}%2C${LNG + 0.004}%2C${LAT + 0.0022}&layer=mapnik&marker=${LAT}%2C${LNG}`}
            />
          </div>
          <a className="mt-2 inline-block text-sm text-primary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`}>
            Open in maps →
          </a>

          <h2 className="mt-12 text-2xl font-semibold">Walking & accessibility</h2>
          <p className="mt-3 text-muted-foreground">
            Expect about 1.5 miles (2.5 km) of gentle walking over 90 minutes, with plenty of stops for stories.
            The route is mostly flat, but some historic courts and alleys are narrow with uneven paving or cobbles.
            If you use a wheelchair or have limited mobility, please get in touch before booking and we'll talk through the route with you.
          </p>

          <h2 className="mt-12 text-2xl font-semibold">Questions & answers</h2>
          <div className="mt-5 divide-y divide-border rounded border border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold group-open:text-primary">{f.q}</summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded border border-border bg-card p-6 md:sticky md:top-6">
          <dl className="space-y-4 text-sm">
            <div><dt className="eyebrow">Starts</dt><dd className="mt-1 text-base">{tour.start}</dd></div>
            <div><dt className="eyebrow">Ends</dt><dd className="mt-1 text-base">{tour.end}</dd></div>
            <div><dt className="eyebrow">Duration</dt><dd className="mt-1 text-base">{tour.duration}</dd></div>
            <div><dt className="eyebrow">Times</dt><dd className="mt-1 text-base">7pm & 9pm nightly from 7 November</dd></div>
            <div><dt className="eyebrow">Price</dt><dd className="mt-1 text-base">£{PRICE_PER_PERSON_GBP} per person</dd></div>
          </dl>
          <Link to="/book" className="mt-6 block rounded bg-primary px-6 py-3 text-center font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">Book this tour</Link>
        </aside>
      </section>
    </>
  );
}
