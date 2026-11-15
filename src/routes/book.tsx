import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/SiteHeader";
import { images, tours } from "@/lib/content";
import { PRICE_PER_PERSON_GBP } from "@/lib/schedule";

const GETYOURGUIDE_BOOKING_URL =
  "https://www.getyourguide.com/london-l57/a-christmas-carol-dickens-london-walking-tour-t1553750/?ranking_uuid=4ec3ee9a-1471-4819-a9ea-51ca0b4d2049&q=dickens+tour+london";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Walking Tour | Street Stop Tours" },
      { name: "description", content: "Book your place on A Christmas Carol: Dickens' London, a 90-minute walking tour of the City. £20 per person, nightly through November and December 2026." },
      { property: "og:title", content: "Book a Walking Tour | Street Stop Tours" },
      { property: "og:description", content: "Reserve your place on our 90-minute Dickens walking tour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Book,
});

function Book() {
  const tour = tours[0]!;

  return (
    <>
      <PageHero eyebrow="Book your place" title="Join us on the streets of Dickens' London." image={images.mansion} />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded border border-border bg-card p-6 sm:p-8">
          <p className="eyebrow">Now booking · £{PRICE_PER_PERSON_GBP} per person</p>
          <h2 className="mt-2 text-2xl font-semibold">{tour.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tour.duration} · {tour.start} → {tour.end}
          </p>

          <dl className="mt-6 grid gap-4 rounded border border-border bg-background/50 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Times</dt>
              <dd className="mt-1 text-base">7pm &amp; 9pm nightly, 7 November – 31 December 2026</dd>
            </div>
            <div>
              <dt className="eyebrow">Meeting point</dt>
              <dd className="mt-1 text-base">{tour.start} (arrive 10 mins early)</dd>
            </div>
          </dl>

          <p className="mt-6 text-base text-muted-foreground">
            To book a tour,{" "}
            <a
              href={GETYOURGUIDE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              click here
            </a>
            .
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Please arrive at Paternoster Square Column 10 minutes before your start time. The guide leaves promptly.
          </p>
        </div>
      </section>
    </>
  );
}
