"use client";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Badge, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost: React.FC<{
  mdxSource: MDXRemoteSerializeResult;
}> = ({ mdxSource }) => {
  return (
    <div className="prose dark:prose-invert mx-auto my-8 p-4">
      <h1 className="text-light-text dark:text-dark-text">
        {mdxSource.frontmatter?.title as string}
      </h1>
      <div className="flex flex-row justify-between items-center">
        <Badge className="capitalize bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary">
          {mdxSource.frontmatter?.category as string}
        </Badge>
        <div>
          <Link href="/blog">
            <Button
              variant="outline"
              size="sm"
              className="text-light-text dark:text-dark-text border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover"
            >
              <MoveLeft size={20} className="mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-2 divide-x mt-2 text-light-muted dark:text-dark-muted">
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
          className="dark:filter dark:brightness-90"
        />
      )}
      <div className="text-light-text dark:text-dark-text">
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  );
};
export default BlogPost;
