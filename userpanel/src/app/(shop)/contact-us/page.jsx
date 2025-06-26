import HeroBanner from "@/components/ui/HeroBanner";
import contactUsDesktop from "@/assets/images/contact-us/contact-us-desktop.webp";
import contactUsMobile from "@/assets/images/contact-us/contact-us-mobile.webp";
import { ContactForm } from "@/components/dynamiComponents";

export default function ContactPage() {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          imageSrc={contactUsDesktop}
          // imageSrcMobile={contactUsMobile}
          // imageSrcDesktop={contactUsDesktop}
          title="Contact Us"
          description="We're here to help – reach out anytime!"
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />
      </div>
      <ContactForm />
    </>
  );
}
