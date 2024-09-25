import { getPostCountByCategory, getPostsByCategory } from "@/actions/blog";
import { Suspense } from "react";
import Link from "next/link";

export default async function Blog() {
  const posts = await getPostsByCategory("all", "none");
  const categoryCounts = await getPostCountByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-light-text dark:text-dark-text">
        Blog Posts
      </h1>
      <Suspense
        fallback={
          <div className="text-light-muted dark:text-dark-muted">
            Loading...
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className="border border-light-border dark:border-dark-border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-light-background dark:bg-dark-background">
                <h2 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text">
                  {post.frontmatter.title}
                </h2>
                <p className="text-light-secondary dark:text-dark-secondary mb-4">
                  {post.frontmatter.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-light-muted dark:text-dark-muted">
                    {post.frontmatter.date}
                  </span>
                  <span className="text-sm bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary px-3 py-1 rounded-full">
                    {post.frontmatter.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Suspense>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
          Categories
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <li key={category} className="mb-2">
              <Link
                href={`/blog?category=${category}`}
                className="flex items-center justify-between p-3 rounded-md bg-light-hover dark:bg-dark-hover hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors duration-200"
              >
                <span className="text-light-text dark:text-dark-text">
                  {category}
                </span>
                <span className="text-sm bg-light-primary/20 text-light-primary dark:bg-dark-primary/20 dark:text-dark-primary px-2 py-1 rounded-full">
                  {count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
