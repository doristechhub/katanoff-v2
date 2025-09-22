import { PAGE_CONSTANTS } from "@/_helper";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import contactUsDesktop from "@/assets/images/contact-us/contact-us-desktop.webp";
import contactUsMobile from "@/assets/images/contact-us/contact-us-mobile.webp";
import { ContactForm, HeroBanner } from "@/components/dynamiComponents";

export default function ContactPage() {
  return (
    <>
      <h1 className="hidden">Contact Us</h1>

      <div className="relative w-full">
        <HeroBanner
          staticSrcMobile={contactUsMobile}
          staticSrcDesktop={contactUsDesktop}
          isStaticBanner={true}
          altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.CONTACT_US].alt}
          titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.CONTACT_US].title}
        />
      </div>
      <ContactForm />
    </>
  );
}
