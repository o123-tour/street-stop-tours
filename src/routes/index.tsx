import { createFileRoute, Link } from "@tanstack/react-router";
import { StreetSign } from "@/components/StreetSign";
import { images, tours } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Street Stop Tours | Historical Walking Tours in London" },
      { name: "description", content: "90-minute storytelling walking tours of London, including A Christmas Carol: Dickens' London." },
      { property: "og:title", content: "Street Stop Tours | Historical Walking Tours in London" },
      { property: "og:description", content: "90-minute storytelling walking tours of London, including A Christmas Carol: Dickens' London." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${images.dome})` }}>
        <div className="absolute inset-0 hero-shade" />
        <div className="relative px-5 text-center">
          <StreetSign size="lg" className="animate-in fade-in zoom-in-95 duration-700" />
          <p className="mt-8 font-display text-xl italic text-foreground/90 sm:text-2xl">History, brought to life, on the streets it happened.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/book" className="rounded bg-primary px-6 py-3 font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">Book a tour</Link>
            <a href="#tours" className="rounded border border-foreground/40 px-6 py-3 font-sign text-sm uppercase tracking-widest hover:border-primary hover:text-primary">Browse tours</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">About us</p>
          <h2 className="mt-3 text-4xl font-semibold">Every street has a story stop.</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Street Stop Tours run 90-minute walking tours through the UK's most storied streets, led by
            costumed guides to help bring history to life. Whether you're an expert on the period, or looking
            to just dive into history, our tours offer something for everyone. We explore the past right where
            it happened, in courtyards, alleys and squares that most people walk straight past.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Small groups, great stories and a guide who knows every hidden corner.
          </p>
        </div>
        <img src={images.mansion} alt="Street Stop guide leading a tour by Mansion House" className="aspect-[4/3] w-full rounded object-cover shadow-2xl" loading="lazy" />
      </section>

      <section id="tours" className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="eyebrow">Our tours</p>
          <h2 className="mt-3 text-4xl font-semibold">Choose your walk</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tours.map((t) =>
              t.status === "available" ? (
                <Link key={t.slug} to="/tours/christmas-carol" className="group overflow-hidden rounded border border-border bg-card md:col-span-2 md:grid md:grid-cols-2">
                  <img src={t.image} alt={t.title} className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="flex flex-col p-6">
                    <span className="eyebrow">Now booking · {t.duration}</span>
                    <h3 className="mt-3 text-2xl font-semibold group-hover:text-primary">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground">{t.tagline}</p>
                    <p className="mt-4 text-sm text-muted-foreground">{t.start} → {t.end}</p>
                    <span className="mt-auto pt-6 font-sign text-sm uppercase tracking-widest text-primary">View tour →</span>
                  </div>
                </Link>
              ) : (
                <div key={t.slug} className="flex flex-col rounded border border-dashed border-border p-6">
                  <span className="eyebrow text-muted-foreground">Coming soon</span>
                  <h3 className="mt-3 text-2xl font-semibold">{t.title}</h3>
                  <p className="mt-3 text-muted-foreground">{t.tagline}</p>
                  <p className="mt-auto pt-6 text-sm text-muted-foreground">{t.area} · {t.duration}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
