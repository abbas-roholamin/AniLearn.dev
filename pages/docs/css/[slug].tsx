import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/atom-one-dark.css";

import Container from "@/components/Container";
import { cssPathFiles, cssFileNames } from "@/utils/mdxFies";
import { AiFillEdit } from "react-icons/ai";

import Navbar, { NavbarSmall } from "@/components/blog-styles/Navbar";
import { MDXComponents } from "@/components/blog-styles/MDXComponents";
import Link from "next/link";

type Props = {
  data: {
    frontmatter: {
      title: string;
      author: string;
      category: string[];
      order: number;
      description: string;
      edit: string;
    };
    readingTime: {
      minutes: number;
      text: string;
      time: number;
      words: number;
    };
    slug: string;
  }[];
  mdxSource: any;
};

export default function Slug({ data, mdxSource }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const sortingArray = data.sort((a, b) => {
    return a.frontmatter.order - b.frontmatter.order;
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <NavbarSmall setIsOpen={setIsOpen} />

      <Container className="flex items-start gap-8 px-4 mt-24 md:px-8">
        <Navbar
          links={sortingArray}
          slug={slug}
          technology="CSS"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div className="w-full pb-24 mt-12 md:mt-0" id="content">
          <MDXRemote {...mdxSource} components={MDXComponents}></MDXRemote>
          <Link
            href={`https://github.com/AliReza1083/AniLearn.dev/tree/main/blog/css/${slug}.mdx`}
            className="flex items-center gap-2 mt-8 text-lg opacity-75 hover:opacity-100"
          >
            Edit the page <AiFillEdit />
          </Link>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps = async ({ params }: any) => {
  const posts = cssFileNames.map((slug: any) => {
    const content = fs.readFileSync(path.join(cssPathFiles, slug));
    const { data } = matter(content);
    return {
      frontmatter: data,
      slug,
    };
  });

  const { slug } = params;
  const filePath = path.join(cssPathFiles, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
    },
  });

  return {
    props: {
      data: posts,
      mdxSource,
      frontmatter: JSON.parse(JSON.stringify(frontmatter)),
      slug,
    },
  };
};

export async function getStaticPaths() {
  const postsPath = cssFileNames.map((slug: any) => {
    return {
      params: {
        slug: slug.replace(/\.mdx?$/, ""),
      },
    };
  });
  return {
    paths: postsPath,
    fallback: false,
  };
}