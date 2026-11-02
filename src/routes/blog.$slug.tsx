import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/SiteHeader";
import { images, posts } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Street Stop Tours Blog` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Post not found | Street Stop Tours" }, { name: "robots", content: "noindex" }],
  }),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow={post.month} title={post.title} image={post.image ?? images.dome} />
      <article className="mx-auto max-w-2xl px-5 py-16">
        {post.body.map((para, i) => (
          <p key={i} className="mb-6 text-lg leading-relaxed text-foreground/85">{para}</p>
        ))}
        <Link to="/blog" className="font-sign text-sm uppercase tracking-widest text-primary">← All posts</Link>
      </article>
    </>
  );
}
