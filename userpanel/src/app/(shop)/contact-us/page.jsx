import HeroBanner from "@/components/ui/HeroBanner";
import contactus from "@/assets/images/contact-us/contact.webp";
import { ContactForm } from "@/components/dynamiComponents";

export default function ContactPage() {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          imageSrc={contactus}
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
