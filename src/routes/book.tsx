import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { createBooking } from "@/lib/bookings.functions";
import { PageHero } from "@/components/SiteHeader";
import { images, tours } from "@/lib/content";
import { formatTime, PRICE_PER_PERSON_GBP, totalPrice, tourDates } from "@/lib/schedule";

const GOOGLE_SCRIPT_URL =
  import.meta.env["VITE_GOOGLE_SCRIPT_URL"] ||
  "https://script.google.com/macros/s/AKfycbwyyLjvqsDpTwFCApM-ZiUS5S029d6jfzzPY0yXvk6vSUa3rt457yAB4NAEw-gnXx7U1g/exec";


const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  notes: z.string().max(1000).optional(),
});

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Walking Tour | Street Stop Tours" },
      { name: "description", content: "Book your place on A Christmas Carol: Dickens' London, a 90-minute walking tour of the City. £20 per person." },
      { property: "og:title", content: "Book a Walking Tour | Street Stop Tours" },
      { property: "og:description", content: "Reserve your place on our 90-minute Dickens walking tour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Book,
});

const field = "mt-2 w-full rounded border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring";
const dates = tourDates();

type SubmittedBooking = {
  reference: string;
  day: number;
  time: string;
  guests: number;
  name: string;
  email: string;
};

function Book() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedBooking | null>(null);
  const saveBooking = useServerFn(createBooking);
  const tour = tours[0]!;
  const selected = dates.find((d) => d.day === day);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const r = schema.safeParse(Object.fromEntries(new FormData(form)));
    const errs: Record<string, string> = {};
    if (!r.success) r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    if (!day || !time) errs["slot"] = "Please choose a date and time";
    setErrors(errs);
    if (!r.success || !day || !time) return;

    const v = r.data;
    const marketingOptIn = new FormData(form).get("marketing") === "on";
    setSubmitting(true);
    try {
      const { reference } = await saveBooking({
        data: { day, time, guests, name: v.name, email: v.email, notes: v.notes || undefined },
      });
      if (!GOOGLE_SCRIPT_URL) {
        throw new Error("Google Script URL not configured");
      }
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          // Use text/plain so the browser sends a simple request without CORS preflight to Google Apps Script
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          reference,
          tour: tour.title,
          date: `${day} November 2026`,
          time: formatTime(time),
          name: v.name,
          email: v.email,
          guests,
          total: `£${totalPrice(guests)}`,
          notes: v.notes || "",
          marketingOptIn: marketingOptIn ? "Yes" : "No",
        }),
      });
      if (!response.ok) throw new Error("Failed to send booking request");
      form.reset();
      setSubmitted({ reference, day, time, guests, name: v.name, email: v.email });
    } catch {
      setErrors({ submit: "Could not send your booking request right now. Please try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Book your place" title="Join us on the streets of Dickens' London." image={images.mansion} />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded border border-border bg-card p-6 sm:p-8">
          {submitted ? (
            <div>
              <p className="eyebrow">Booking request sent</p>
              <h2 className="mt-2 text-2xl font-semibold">Thank you, {submitted.name}!</h2>
              <p className="mt-3 text-muted-foreground">
                Your booking request for <strong className="text-foreground">{tour.title}</strong> has been sent. We'll be in touch at{" "}
                <strong className="text-foreground">{submitted.email}</strong> shortly to confirm your place.
              </p>
              <dl className="mt-6 grid gap-4 rounded border border-border bg-background/50 p-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">Reference</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-primary">{submitted.reference}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Date & time</dt>
                  <dd className="mt-1 text-base">{submitted.day} November 2026 at {formatTime(submitted.time)}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Guests</dt>
                  <dd className="mt-1 text-base">{submitted.guests} (£{totalPrice(submitted.guests)})</dd>
                </div>
                <div>
                  <dt className="eyebrow">Meeting point</dt>
                  <dd className="mt-1 text-base">{tour.start} (arrive 10 mins early)</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">Keep your reference: you'll need it with your email to leave a review after the tour.</p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setDay(null);
                  setTime(null);
                }}
                className="mt-6 rounded border border-border px-6 py-3 font-sign text-sm uppercase tracking-widest hover:border-primary hover:text-primary"
              >
                Make another booking
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">Now booking · £{PRICE_PER_PERSON_GBP} per person</p>
              <h2 className="mt-2 text-2xl font-semibold">{tour.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{tour.duration} · {tour.start} → {tour.end}</p>

              <h3 className="mt-8 font-sign text-sm uppercase tracking-widest">1. Choose a date (November 2026)</h3>
              <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8">
                {dates.map((d) => {
                  const off = d.times.length === 0;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      disabled={off}
                      onClick={() => { setDay(d.day); setTime(null); }}
                      className={`rounded border px-2 py-2 text-sm ${off ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50" : d.day === day ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">No tours on 28 November.</p>

              {selected && (
                <>
                  <h3 className="mt-6 font-sign text-sm uppercase tracking-widest">2. Choose a time</h3>
                  <div className="mt-3 flex gap-2">
                    {selected.times.map((t) => (
                      <button key={t} type="button" onClick={() => setTime(t)} className={`rounded border px-5 py-2 ${t === time ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {errors["slot"] && <p className="mt-2 text-sm text-destructive">{errors["slot"]}</p>}

              <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2" noValidate>
                <label className="text-sm">Your name<input name="name" className={field} />{errors["name"] && <span className="mt-1 block text-destructive">{errors["name"]}</span>}</label>
                <label className="text-sm">Email<input name="email" type="email" className={field} />{errors["email"] && <span className="mt-1 block text-destructive">{errors["email"]}</span>}</label>
                <label className="text-sm">Number of guests
                  <input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className={field} />
                </label>
                <div className="flex items-end text-lg">Total: <strong className="ml-2 text-primary">£{totalPrice(guests)}</strong></div>
                <label className="text-sm sm:col-span-2">Anything we should know? (e.g. accessibility needs)
                  <textarea name="notes" rows={3} maxLength={1000} className={field} />
                </label>
                <label className="flex items-center gap-3 text-sm text-muted-foreground sm:col-span-2">
                  <input type="checkbox" name="marketing" defaultChecked className="h-4 w-4 accent-primary" />
                  <span>Keep me updated by email about future tours (including Sherlock Holmes &amp; Royal London).</span>
                </label>
                <p className="text-sm text-muted-foreground sm:col-span-2">Please arrive at Paternoster Square Column 10 minutes before your start time. The guide leaves promptly.</p>
                {errors["submit"] && <p className="text-sm text-destructive sm:col-span-2">{errors["submit"]}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-primary px-6 py-3 font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60 sm:col-span-2"
                >
                  {submitting ? "Sending booking request…" : "Request booking"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
