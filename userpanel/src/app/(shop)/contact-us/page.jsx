import contactUsDesktop from "@/assets/images/contact-us/contact-us-desktop.webp";
import contactUsMobile from "@/assets/images/contact-us/contact-us-mobile.webp";
import { ContactForm, HeroBanner } from "@/components/dynamiComponents";

export default function ContactPage() {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          staticSrcMobile={contactUsMobile}
          staticSrcDesktop={contactUsDesktop}
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />
      </div>
      <ContactForm />
    </>
  );
}
