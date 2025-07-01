import { CustomImg } from "../dynamiComponents";
import { LinkButton, PrimaryLinkButton } from "./button";

const ResponsiveImageAndContent = ({
  desktopImage,
  mobileImage,
  title = "New Arrivals",
  subtitle = "New Designer Collection",
  linkText = "Explore Collection",
  linkHref = "#",
}) => {
  return (
    <>
      {/* Desktop View */}
      <section className="relative hidden sm:block">
        <CustomImg
          src={desktopImage}
          alt={`${title} Banner`}
          className="w-full"
        />
        <div className="absolute top-0 left-[6%] container mx-auto h-full flex items-end xs:items-center pb-10 xs:pb-0">
          <BannerContent
            title={title}
            subtitle={subtitle}
            linkText={linkText}
            linkHref={linkHref}
          />
        </div>
      </section>

      {/* Mobile & Tablet View */}
      <section className="sm:hidden relative">
        <CustomImg src={mobileImage} alt={`${title} Banner`} className="" />
        <div className="absolute container mx-auto h-full flex justify-center items-end  bottom-6 sm:bottom-10">
          <BannerContent
            title={title}
            subtitle={subtitle}
            linkText={linkText}
            linkHref={linkHref}
          />
        </div>
      </section>
    </>
  );
};

const BannerContent = ({ title, subtitle, linkText, linkHref }) => (
  <div className="text-white max-w-xl text-center">
    <h2 className="text-2xl md:text-4xl xl:text-6xl 4xl:text-7xl font-bold uppercase">
      {title}
    </h2>
    <p className="xl:mt-2 text-sm md:text-lg xl:text-xl tracking-wide xl:tracking-[0.3em]">
      {subtitle}
    </p>
    <div className="flex sm:hidden justify-center mt-2 md:mt-4 lg:mt-6">
      <LinkButton
        href={linkHref}
        className="!bg-transparent hover:!bg-black hover:!text-white hover:!border-black"
      >
        {" "}
        {linkText}
      </LinkButton>
    </div>
    <div className="hidden sm:flex justify-center mt-2 md:mt-4 lg:mt-6">
      <PrimaryLinkButton
        variant="whiteHover"
        className="!uppercase !rounded-full !bg-transparent "
        href={linkHref}
      >
        {linkText}
      </PrimaryLinkButton>
    </div>
  </div>
);

export default ResponsiveImageAndContent;
