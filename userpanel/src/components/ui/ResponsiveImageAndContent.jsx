import { CustomImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";

const ResponsiveImageAndContent = ({
  desktopImage,
  mobileImage,
  title = "New Arrivals",
  subtitle = "NEW Designer Collection",
  linkText = "Explore Collection",
  linkHref = "#",
}) => {
  return (
    <>
      {/* Desktop View */}
      <section className="hidden lg:block relative w-full h-[95vh] overflow-hidden">
        <CustomImg
          src={desktopImage}
          alt={`${title} Banner`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 container mx-auto h-full flex items-end xs:items-center pb-10 xs:pb-0">
          <BannerContent
            title={title}
            subtitle={subtitle}
            linkText={linkText}
            linkHref={linkHref}
          />
        </div>
      </section>

      {/* Mobile & Tablet View */}
      <section className="lg:hidden relative w-full h-[90vh] overflow-hidden">
        <CustomImg
          src={mobileImage}
          alt={`${title} Banner`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 container mx-auto h-full flex justify-center items-end  bottom-12 sm:bottom-20 md:bottom-12">
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
    <h2 className="text-3xl md:text-5xl xl:text-7xl font-bold uppercase">
      {title}
    </h2>
    <p className="mt-2 text-base md:text-lg xl:text-xl tracking-widest">
      {subtitle}
    </p>
    <div className="flex justify-center mt-2 lg:mt-6">
      <PrimaryLinkButton
        variant="whiteHover"
        className="!uppercase !rounded-full"
        href={linkHref}
      >
        {linkText}
      </PrimaryLinkButton>
    </div>
  </div>
);

export default ResponsiveImageAndContent;
