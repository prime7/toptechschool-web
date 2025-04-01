"use server";

import fs from "fs/promises";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

const postDirectory = path.join(process.cwd(), "_posts");

interface Frontmatter {
  category: string;
  date: string;
  views: number;
  title: string;
  description: string;
  author: string;
  tags: string[];
  status?: string;
  [key: string]: string | number | string[] | boolean | undefined;
}

interface PostData {
  slug: string;
  frontmatter: Frontmatter;
}

const readFileContent = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, "utf-8");
};

const parsePostData = (fileName: string, content: string): PostData => {
  const slug = fileName.replace(".mdx", "");
  const { data } = matter(content);
  const frontmatter = data as Frontmatter;
  return { slug, frontmatter };
};

const getPosts = async (options?: { 
  includeDrafts?: boolean, 
  category?: string,
  filter?: string
}): Promise<PostData[]> => {
  const { includeDrafts = false, category, filter } = options || {};
  
  const files = await fs.readdir(postDirectory);
  let posts = await Promise.all(
    files.map(async (fileName) => {
      const content = await readFileContent(path.join(postDirectory, fileName));
      return parsePostData(fileName, content);
    })
  );
  
  if (!includeDrafts) {
    posts = posts.filter(post => post.frontmatter.status !== "draft");
  }
  
  if (category && category !== "all") {
    posts = posts.filter(post => post.frontmatter.category === category);
  }
  
  const sortByDate = (a: PostData, b: PostData) =>
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime();
    
  // Apply sorting based on filter
  if (filter) {
    switch (filter) {
      case "popular":
        return posts.sort((a, b) => b.frontmatter.views - a.frontmatter.views);
      case "latest":
        const currentYear = new Date().getFullYear();
        return posts
          .filter(post => new Date(post.frontmatter.date).getFullYear() === currentYear)
          .sort(sortByDate);
      default:
        return posts.sort(sortByDate);
    }
  }
  
  return posts.sort(sortByDate);
};

const getPost = async (
  slug: string
): Promise<{
  mdxSource: MDXRemoteSerializeResult;
}> => {
  const filePath = path.join(postDirectory, `${slug}.mdx`);
  const content = await readFileContent(filePath);
  const mdxSource = await serialize(content, { parseFrontmatter: true });
  return { mdxSource };
};

const getAllCategories = async (): Promise<string[]> => {
  const posts = await getPosts({ includeDrafts: false });
  const categories = posts.map(post => post.frontmatter.category);
  return Array.from(new Set(categories));
};

const getPostCountByCategory = async (): Promise<Record<string, number>> => {
  const posts = await getPosts({ includeDrafts: false });
  
  return posts.reduce((acc, post) => {
    const category = post.frontmatter.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const getPostsByCategory = async (
  category: string,
  filter: string
): Promise<PostData[]> => {
  return getPosts({ category, filter, includeDrafts: false });
};

export {
  getPosts,
  getPost,
  getAllCategories,
  getPostCountByCategory,
  getPostsByCategory,
};
