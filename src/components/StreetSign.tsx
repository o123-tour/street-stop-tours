import { cn } from "@/lib/utils";

/** Brand logo: the name set in a classic London street sign. */
export function StreetSign({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = {
    sm: { wrap: "p-[3px] border-2", inner: "px-3 py-1", main: "text-sm", sub: "text-[0.5rem]" },
    md: { wrap: "p-1 border-[3px]", inner: "px-6 py-2", main: "text-2xl", sub: "text-[0.6rem]" },
    lg: { wrap: "p-1.5 border-4", inner: "px-8 py-4 sm:px-14 sm:py-6", main: "text-4xl sm:text-7xl", sub: "text-xs sm:text-base" },
  }[size];
  return (
    <div className={cn("inline-block rounded-md bg-sign border-sign-ink shadow-2xl", s.wrap, className)}>
      <div className={cn("rounded-sm border-2 border-sign-ink text-center font-sign", s.inner)}>
        <div className={cn("font-bold uppercase leading-none tracking-wide text-sign-ink", s.main)}>
          Street Stop
        </div>
        <div className="my-1 h-px bg-sign-ink/30" />
        <div className={cn("font-semibold uppercase tracking-[0.35em] text-sign-red", s.sub)}>
          Tours · EC
        </div>
      </div>
    </div>
  );
}
