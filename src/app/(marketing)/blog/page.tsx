import { getPostCountByCategory, getPostsByCategory } from "@/actions/blog";
import { Suspense } from "react";
import Link from "next/link";

export default async function Blog() {
  const posts = await getPostsByCategory("all", "none");
  const categoryCounts = await getPostCountByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2">
                  {post.frontmatter.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.frontmatter.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {post.frontmatter.date}
                  </span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {post.frontmatter.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Suspense>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <ul>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <li key={category} className="mb-2">
              <Link
                href={`/blog?category=${category}`}
                className="hover:underline"
              >
                {category}: {count} post{count !== 1 ? "s" : ""}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
