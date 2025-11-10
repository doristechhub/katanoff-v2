import { blogData } from "@/_utils/blogData";
import DynamicBlogPage from "@/components/ui/blogs/DynamicBlogPage";

export async function generateStaticParams() {
  return blogData.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPage() {
  return <DynamicBlogPage />;
}
