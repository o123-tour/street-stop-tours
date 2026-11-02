// A review is allowed only after the booked tour's start time (London time; November is UTC).
export function canReview(tourDate: string, tourTime: string, now: Date) {
  return now.getTime() >= new Date(`${tourDate}T${tourTime}:00Z`).getTime();
}
