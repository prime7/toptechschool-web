"use client";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BlogPost: React.FC<{
  mdxSource: MDXRemoteSerializeResult;
}> = ({ mdxSource }) => {
  return (
    <article className="container mx-auto px-4 py-8">
      <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl w-full">
        <h1 className="text-foreground text-3xl lg:text-5xl">
          {mdxSource.frontmatter?.title as string}
        </h1>
        <div className="flex flex-row justify-between items-center">
          <Badge className="capitalize bg-primary/10 text-primary">
            {mdxSource.frontmatter?.category as string}
          </Badge>
          <div>
            <Link href="/blog">
              <Button
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-accent"
              >
                <MoveLeft size={20} className="mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row gap-2 divide-x mt-2 text-sm text-gray-600 dark:text-muted-foreground">
          <span>Published on: {mdxSource.frontmatter?.date as string}</span>
          <span className="pl-2">
            {(mdxSource.frontmatter?.author as { name: string }[])[0]?.name}
          </span>
        </div>
        {typeof mdxSource.frontmatter?.coverImage === "string" && (
          <Image
            height={Number(mdxSource.frontmatter.coverImageHeight) || 0}
            width={Number(mdxSource.frontmatter.coverImageWidth) || 0}
            src={mdxSource.frontmatter.coverImage}
            alt="Blog thumbnail"
            className="filter brightness-100 w-full rounded-lg"
          />
        )}
        <div className="text-foreground">
          <MDXRemote {...mdxSource} />
        </div>
      </div>
    </article>
  );
};
export default BlogPost;
