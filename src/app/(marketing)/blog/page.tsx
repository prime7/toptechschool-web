import { getPostCountByCategory, getPostsByCategory } from "@/actions/blog";
import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "./_components/BlogCard";

interface BlogPageProps {
  searchParams: { category?: string };
}

export default async function Blog({ searchParams }: BlogPageProps) {
  const selectedCategory = searchParams.category || "all";
  const posts = await getPostsByCategory(selectedCategory, "none");
  const categoryCounts = await getPostCountByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/blog" className="no-underline">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm ${selectedCategory === "all" ? "bg-emerald-500/10 text-emerald-600" : ""}`}
            >
              All
            </Badge>
          </Link>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className="no-underline"
            >
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm ${selectedCategory === category ? "bg-emerald-500/10 text-emerald-600" : ""}`}
              >
                {category} ({count})
              </Badge>
            </Link>
          ))}
        </div>
      </div>
      <Suspense
        fallback={<div className="text-muted-foreground">Loading...</div>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="no-underline"
            >
              <BlogCard
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                date={post.frontmatter.date}
                category={post.frontmatter.category}
              />
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
