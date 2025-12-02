"use client";

import CustomImg from "../custom-img";
import {
  AccordionTabs,
  BlogSwipper,
  TableOfContents,
} from "@/components/dynamiComponents";
import Link from "next/link";
import { blogData, getBlogBySlug } from "@/_utils/blogData";
import CommonNotFound from "../CommonNotFound";
import { useParams } from "next/navigation";

export default function DynamicBlogPage() {
  const params = useParams();
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return <CommonNotFound message="Blog Not Found!" />;
  }

  const moreBlogs = blogData.filter((x) => x.slug !== blog.slug);
  const gridCols = "lg:grid-cols-[70%_30%] 2xl:grid-cols-[75%_25%]";

  return (
    <>
      <section className="mx-auto px-4 md:px-0 pt-12 xl:pt-16 2xl:pt-20 leading-relaxed xl:px-12">
        <section className="mb-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h1
              className={`text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold font-castoro leading-relaxed`}
            >
              {blog.fullTitle}
            </h1>
            <p className="pt-4 lg:pt-6 2xl:pt-8 text-sm md:text-base xl:text-lg font-medium text-[#686868]">
              {blog.description[0]}
            </p>
          </div>
          <CustomImg
            src={blog.heroImg}
            titleAttr={blog.titleAttr}
            altAttr={blog.altAttr}
            className="lg:h-[80vh] md:w-[80%] object-cover mt-6 m-auto"
          />
        </section>

        <div className="mt-6 md:mt-10 xl:mt-12 2xl:mt-16 border-t border-grayborder" />
        <div
          className={`grid ${gridCols} gap-6 lg:gap-10 container1400 pt-8 md:pt-12 xl:pt-16 2xl:pt-20 `}
        >
          <div>
            {/* Render introContent */}
            {blog.introContent && (
              <section className="flex flex-col gap-4 text-sm lg:text-base">
                {blog.introContent}
              </section>
            )}

            {/* Dynamic sections */}
            {blog.sections.map((section, idx) => {
              const marginTop = blog.introContent || idx !== 0 ? "mt-10" : "";

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`${marginTop} flex flex-col gap-4 text-sm lg:text-base`}
                >
                  {section.title && (
                    <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                      {section.title}
                    </h2>
                  )}
                  {section.content}
                </section>
              );
            })}
          </div>
          <div className="hidden lg:block sticky top-28 self-start">
            <TableOfContents sections={blog.tocSections} />
            <div className="mt-10">
              <p className="text-lg xl:text-xl font-semibold mb-4 font-castoro">
                More Blogs
              </p>
              <div className="flex flex-col gap-6">
                {moreBlogs?.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blogs/${b.slug}`}
                    className="flex gap-4 hover:opacity-80 transition"
                  >
                    <div className="w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
                      <CustomImg
                        src={b.thumbnailImage}
                        altAttr={b?.altAttr}
                        titleAttr={b?.titleAttr}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-2 uppercase">
                        {b.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          {blog.faq && blog.faq.length > 0 && (
            <section id="faq" className="mt-4 md:mt-6 xl:mt-8">
              <h3 className="text-xl lg:text-2xl font-semibold font-castoro text-gray-900">
                FAQs
              </h3>
              <div className="border border-gray-border mt-6">
                <AccordionTabs
                  tabs={blog.faq}
                  forceResetKey={blog.slug}
                  contentCustomClass="!ps-5 text-baseblack"
                  labelCustomClass="!text-lg md:!text-xl"
                  customClass="!py-3"
                />
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="mt-8 xl:mt-16 2xl:mt-20 pt-8 md:pt-10 xl:pt-16 bg-alabaster pb-16 overflow-x-clip">
        <div className="px-6 xl:px-12 container">
          <h2 className="text-2xl xl:text-3xl font-medium font-castoro text-baseblack mt-6 pb-8 xl:pb-10 text-center">
            Discover More
          </h2>
          <BlogSwipper blogData={moreBlogs} />
        </div>
      </section>
    </>
  );
}
