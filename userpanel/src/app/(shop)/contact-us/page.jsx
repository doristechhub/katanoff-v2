import HeroBanner from "@/components/ui/HeroBanner";
import contactus from "@/assets/images/contact-us/contact.webp";
import { ContactForm } from "@/components/dynamiComponents";

export default function ContactPage() {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          imageSrc={contactus}
          title=""
          description=""
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-2xl md:text-4xl 2xl:text-5xl text-white font-castoro capitalize">Contact Us</h1>
          <p className="mt-2 text-base md:text-lg font-Figtree">
            We're here to help – reach out anytime!
          </p>
          <div className="mt-4 w-8 h-[1px] bg-white" />
        </div>
      </div>

      <ContactForm />
    </>
  );
}
