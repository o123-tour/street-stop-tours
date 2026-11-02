CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  tour_slug text NOT NULL,
  tour_date date NOT NULL,
  tour_time text NOT NULL,
  guests int NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  tour_slug text NOT NULL,
  name text NOT NULL,
  rating int NOT NULL,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (true);