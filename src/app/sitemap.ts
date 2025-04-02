import { getPosts } from '@/actions/blog';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const posts = await getPosts();
  const postsRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    priority: 0.8
  }));

  const latestPostDate = posts.length > 0 
    ? new Date(Math.max(...posts.map(post => new Date(post.frontmatter.date).getTime())))
    : new Date();

  const routes = [
    {
      path: '',
      priority: 1,
      lastModified: new Date()
    },
    {
      path: 'blog',
      priority: 1,
      lastModified: latestPostDate
    },
    {
      path: 'startup',
      priority: 0.8,
      lastModified: new Date('2024-01-01') 
    }
  ].map((route) => ({
    url: `${siteUrl}/${route.path}`,
    lastModified: route.lastModified,
    priority: route.priority,
  }));

  return [...routes, ...postsRoutes];
}