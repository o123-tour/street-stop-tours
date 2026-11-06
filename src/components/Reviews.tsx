import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listReviews, submitReview } from "@/lib/bookings.functions";

const field = "mt-2 w-full rounded border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring";

export function Reviews({ slug }: { slug: string }) {
  const fetchReviews = useServerFn(listReviews);
  const send = useServerFn(submitReview);
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews", slug], queryFn: () => fetchReviews({ data: { slug } }) });
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setMsg(null);
    try {
      const r = await send({ data: { reference: String(f.get("reference")), email: String(f.get("email")), comment: String(f.get("comment")), rating } });
      if (r.error) setMsg({ ok: false, text: r.error });
      else {
        setMsg({ ok: true, text: "Thank you! Your review is now live." });
        form.reset();
        qc.invalidateQueries({ queryKey: ["reviews", slug] });
      }
    } catch {
      setMsg({ ok: false, text: "Please check your details: comments need at least 5 characters." });
    } finally {
      setBusy(false);
    }
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <h2 className="mt-12 text-2xl font-semibold">Reviews</h2>
      {reviews.length > 0 ? (
        <p className="mt-2 text-muted-foreground"><span className="text-primary">{"★".repeat(Math.round(avg))}</span> {avg.toFixed(1)} from {reviews.length} review{reviews.length > 1 ? "s" : ""}</p>
      ) : (
        <p className="mt-2 text-muted-foreground">No reviews yet. Been on the tour? Be the first.</p>
      )}
      <div className="mt-5 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded border border-border bg-card p-5">
            <p className="text-primary">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></p>
            <p className="mt-2">{r.comment}</p>
            <p className="mt-2 text-sm text-muted-foreground">{r.name} · {new Date(r.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded border border-border p-5 sm:grid-cols-2">
        <p className="text-sm text-muted-foreground sm:col-span-2">Been on the tour? Enter your booking reference and email to leave a review.</p>
        <label className="text-sm">Booking reference<input name="reference" required placeholder="SST-XXXXXX" className={field} /></label>
        <label className="text-sm">Email used to book<input name="email" type="email" required className={field} /></label>
        <div className="text-sm sm:col-span-2">Rating
          <div className="mt-2 flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} stars`} onClick={() => setRating(n)} className={n <= rating ? "text-primary" : "text-muted-foreground"}>★</button>
            ))}
          </div>
        </div>
        <label className="text-sm sm:col-span-2">Your review<textarea name="comment" required rows={3} maxLength={1000} className={field} /></label>
        {msg && <p className={`text-sm sm:col-span-2 ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
        <button disabled={busy} className="rounded bg-primary px-6 py-3 font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60 sm:col-span-2">
          {busy ? "Sending…" : "Post review"}
        </button>
      </form>
    </div>
  );
}
