import { HeroBanner } from "@/components/dynamiComponents";
import { helperFunctions, PAGE_CONSTANTS } from "@/_helper";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import CustomImg from "@/components/ui/custom-img";
import blogHeroDesktop from "@/assets/images/blogs/blog-hero-desktop.webp";
import blogHeroMobile from "@/assets/images/blogs/blog-hero-mobile.webp";
import { blogData } from "@/_utils/blogData";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";

export default function BlogPage() {
  return (
    <>
      <h1 className="hidden">Blogs</h1>

      <HeroBanner
        staticSrcMobile={blogHeroMobile}
        staticSrcDesktop={blogHeroDesktop}
        isStaticBanner={true}
        altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.BLOGS].alt}
        titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.BLOGS].title}
        title="Blogs"
        description="We're here to help – reach out anytime!"
      />

      <section className="mt-10 md:mt-12 xl:mt-16 flex flex-col gap-4 container text-base lg:text-lg">
        <p className="text-2xl lg:text-4xl font-castoro text-center font-bold">
          Latest News
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-x-12 gap-y-8 pt-8 xl:pt-10">
          {blogData.map((blog) => {
            const blogUrl = `/blogs/${helperFunctions.stringReplacedWithDash(
              blog.title
            )}`;

            return (
              <div key={blog?.id} className="bg-white rounded-lg p-3.5">
                <Link href={blogUrl}>
                  <CustomImg
                    src={blog?.thumbnailImage}
                    alt={blog?.title}
                    className="w-full"
                  />
                </Link>

                <div className="mt-5">
                  <h3 className="text-lg xl:text-2xl font-semibold capitalize text-baseblack">
                    <Link href={blogUrl}>{blog.title}</Link>
                  </h3>

                  {blog.subtitle && (
                    <p className="text-[#686868] text-sm 2xl:text-base mt-3">
                      {blog.subtitle}
                    </p>
                  )}

                  <p className="text-[#686868] text-sm 2xl:text-base mt-2 line-clamp-2">
                    {blog.description}
                  </p>

                  <Link
                    href={blogUrl}
                    className="text-primary mt-3 inline-flex items-center gap-1 text-sm 2xl:text-base font-semibold hover:underline"
                  >
                    Read more <FaChevronRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
