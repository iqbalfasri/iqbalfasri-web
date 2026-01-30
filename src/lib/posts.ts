import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  categories?: string[];
  content: string;
}

const postsDirectory = join(process.cwd(), "src/content/posts");

export function getAllPosts(): Post[] {
  try {
    const fileNames = readdirSync(postsDirectory);
    const posts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        return getPostBySlug(slug);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
  } catch (error) {
    console.warn("No posts directory found or error reading posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post {
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags,
    categories: data.categories,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.warn("No posts directory found or error reading posts:", error);
    return [];
  }
}
