import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageHero } from "@/components/SiteHeader";
import { images, tours } from "@/lib/content";

const BOOKING_EMAIL = "hello@streetstoptours.co.uk";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  date: z.string().min(1, "Please choose a date"),
  guests: z.coerce.number().int().min(1).max(20),
  notes: z.string().max(1000).optional(),
});

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Walking Tour | Street Stop Tours" },
      { name: "description", content: "Book your place on A Christmas Carol: Dickens' London, a 90-minute walking tour of the City." },
      { property: "og:title", content: "Book a Walking Tour | Street Stop Tours" },
      { property: "og:description", content: "Reserve your place on our 90-minute Dickens walking tour." },
    ],
  }),
  component: Book,
});

const field = "mt-2 w-full rounded border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring";

function Book() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tour = tours[0];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const v = r.data;
    const body = `Tour: ${tour.title}\nName: ${v.name}\nEmail: ${v.email}\nDate: ${v.date}\nGuests: ${v.guests}\nNotes: ${v.notes ?? ""}`;
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent("Booking request: " + tour.title)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <PageHero eyebrow="Book your place" title="Join us on the streets of Dickens' London." image={images.mansion} />
      <section className="mx-auto max-w-2xl px-5 py-16">
        <div className="rounded border border-border bg-card p-6 sm:p-8">
          <p className="eyebrow">Now booking</p>
          <h2 className="mt-2 text-2xl font-semibold">{tour.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{tour.duration} · {tour.start} → {tour.end}</p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2" noValidate>
            {([
              ["name", "Your name", "text"],
              ["email", "Email", "email"],
              ["date", "Preferred date", "date"],
              ["guests", "Number of guests", "number"],
            ] as const).map(([n, label, type]) => (
              <label key={n} className="text-sm">
                {label}
                <input name={n} type={type} min={type === "number" ? 1 : undefined} defaultValue={n === "guests" ? 2 : undefined} className={field} />
                {errors[n] && <span className="mt-1 block text-destructive">{errors[n]}</span>}
              </label>
            ))}
            <label className="text-sm sm:col-span-2">
              Anything we should know?
              <textarea name="notes" rows={3} maxLength={1000} className={field} />
            </label>
            <button type="submit" className="rounded bg-primary px-6 py-3 font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 sm:col-span-2">
              Request booking
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
