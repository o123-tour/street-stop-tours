import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GOOGLE_SCRIPT_URL } from "@/lib/google-script";

const field = "mt-2 w-full rounded border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring";

type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
};

async function fetchReviewsFromSheet(slug: string): Promise<ReviewItem[]> {
  if (!GOOGLE_SCRIPT_URL) return [];
  try {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=listReviews&slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { reviews?: ReviewItem[] };
    return Array.isArray(data.reviews) ? data.reviews : [];
  } catch {
    return [];
  }
}

export function Reviews({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: () => fetchReviewsFromSheet(slug),
  });
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const reference = String(f.get("reference") ?? "").trim().toUpperCase();
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const comment = String(f.get("comment") ?? "").trim();

    if (comment.length < 5) {
      setMsg({ ok: false, text: "Please check your details: comments need at least 5 characters." });
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "submitReview",
          slug,
          reference,
          email,
          rating,
          comment,
        }),
      });
      if (!response.ok) throw new Error("Failed to post review");
      const r = (await response.json()) as { ok?: boolean; error?: string };
      if (r.error) {
        setMsg({ ok: false, text: r.error });
      } else {
        setMsg({ ok: true, text: "Thank you! Your review is now live." });
        form.reset();
        qc.invalidateQueries({ queryKey: ["reviews", slug] });
      }
    } catch {
      setMsg({ ok: false, text: "Could not submit your review right now. Please try again in a moment." });
    } finally {
      setBusy(false);
    }
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <h2 className="mt-12 text-2xl font-semibold">Reviews</h2>
      {reviews.length > 0 ? (
        <p className="mt-2 text-muted-foreground">
          <span className="text-primary">{"★".repeat(Math.round(avg))}</span> {avg.toFixed(1)} from {reviews.length} review{reviews.length > 1 ? "s" : ""}
        </p>
      ) : (
        <p className="mt-2 text-muted-foreground">No reviews yet. Been on the tour? Be the first.</p>
      )}
      <div className="mt-5 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded border border-border bg-card p-5">
            <p className="text-primary">
              {"★".repeat(r.rating)}
              <span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span>
            </p>
            <p className="mt-2">{r.comment}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {r.name} · {new Date(r.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded border border-border p-5 sm:grid-cols-2">
        <p className="text-sm text-muted-foreground sm:col-span-2">Been on the tour? Enter your booking reference and email to leave a review.</p>
        <label className="text-sm">
          Booking reference
          <input name="reference" required placeholder="SST-XXXXXX" className={field} />
        </label>
        <label className="text-sm">
          Email used to book
          <input name="email" type="email" required className={field} />
        </label>
        <div className="text-sm sm:col-span-2">
          Rating
          <div className="mt-2 flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} stars`} onClick={() => setRating(n)} className={n <= rating ? "text-primary" : "text-muted-foreground"}>
                ★
              </button>
            ))}
          </div>
        </div>
        <label className="text-sm sm:col-span-2">
          Your review
          <textarea name="comment" required rows={3} maxLength={1000} className={field} />
        </label>
        {msg && <p className={`text-sm sm:col-span-2 ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
        <button disabled={busy} className="rounded bg-primary px-6 py-3 font-sign text-sm font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60 sm:col-span-2">
          {busy ? "Sending…" : "Post review"}
        </button>
      </form>
    </div>
  );
}
