import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/SiteHeader";
import { images, posts } from "@/lib/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Monthly History Blog | Street Stop Tours" },
      { name: "description", content: "A new story from London's past every month, from the Street Stop Tours guides." },
      { property: "og:title", content: "Monthly History Blog | Street Stop Tours" },
      { property: "og:description", content: "A new story from London's past every month." },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <>
      <PageHero eyebrow="The history blog" title="A new story from London's past, every month." image={images.stephen} />
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="space-y-10">
          {posts.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group grid gap-6 border-b border-border pb-10 sm:grid-cols-[220px_1fr]">
              {p.image && <img src={p.image} alt="" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />}
              <div>
                <p className="eyebrow">{p.month}</p>
                <h2 className="mt-2 text-2xl font-semibold group-hover:text-primary">{p.title}</h2>
                <p className="mt-3 text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
