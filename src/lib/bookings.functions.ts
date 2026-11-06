import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { canBook, isoFor, timesForDay } from "@/lib/schedule";
import { canReview } from "@/lib/review-rules";

const bookingSchema = z.object({
  month: z.number().int().min(11).max(12),
  day: z.number().int().min(1).max(31),
  time: z.string().regex(/^\d\d:00$/),
  guests: z.number().int().min(1).max(20),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  notes: z.string().max(1000).optional(),
});

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "SST-";
  for (const b of crypto.getRandomValues(new Uint8Array(6))) s += chars[b % chars.length];
  return s;
}

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    if (!timesForDay(data.month, data.day).includes(data.time)) throw new Error("That tour time isn't available.");
    if (!canBook(data.month, data.day, data.time, new Date())) {
      return { reference: null, error: "Booking enquiries close four hours before the tour starts. Please choose a later tour." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const reference = makeReference();
    const { error } = await supabaseAdmin.from("bookings").insert({
      reference,
      tour_slug: "christmas-carol",
      tour_date: isoFor(data.month, data.day),
      tour_time: data.time,
      guests: data.guests,
      name: data.name,
      email: data.email.toLowerCase(),
      notes: data.notes ?? null,
    });
    if (error) {
      console.error(error);
      throw new Error("Could not save your booking. Please try again.");
    }
    return { reference, error: null };
  });

const reviewSchema = z.object({
  reference: z.string().trim().toUpperCase().min(4).max(20),
  email: z.string().trim().email().max(255),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(1000),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => reviewSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("id, tour_slug, tour_date, tour_time, name")
      .eq("reference", data.reference)
      .eq("email", data.email.toLowerCase())
      .maybeSingle();
    if (!booking) return { error: "We couldn't find a booking with that reference and email." };
    if (!canReview(booking.tour_date, booking.tour_time, new Date()))
      return { error: "You can leave a review once your tour has taken place." };
    const { error } = await supabaseAdmin.from("reviews").insert({
      booking_id: booking.id,
      tour_slug: booking.tour_slug,
      name: booking.name.split(" ")[0] ?? booking.name,
      rating: data.rating,
      comment: data.comment,
    });
    if (error) return { error: "A review has already been left for this booking." };
    return { error: null };
  });

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().max(50) }).parse(d))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: rows } = await sb
      .from("reviews")
      .select("id, name, rating, comment, created_at")
      .eq("tour_slug", data.slug)
      .order("created_at", { ascending: false });
    return rows ?? [];
  });
