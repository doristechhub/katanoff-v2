import CustomJewelryForm from "@/components/ui/CustomJewelryForm";
import contactus from "@/assets/images/contact-us/contact.webp";
import HeroBanner from "./HeroBanner";

export default function CustomJewelry() {
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
          <h1 className="text-2xl md:text-4xl 2xl:text-5xl text-white font-castoro capitalize">
            Custom Jewelry
          </h1>
          <p className="mt-2 text-base md:text-lg font-Figtree">
            We're here to help – reach out anytime!
          </p>
          <div className="mt-4 w-8 h-[1px] bg-white" />
        </div>
      </div>
      <section className="container pt-4 md:pt-8 lg:pt-12 2xl:pt-20">
        <div className="space-y-10 max-w-3xl mx-auto font-Figtree">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              1
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
                Describe Your Custom Jewelry
              </h3>
              <p className="text-baseblack">
                Provide details such as gold karat and color, desired timeframe
                for completion, type of jewelry (ring, pendant, etc.), materials
                (diamond, solid gold, enamel, etc.), and your budget.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              2
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
                Upload Reference Images
              </h3>
              <p className="text-baseblack">
                Upload any reference images for the design of your custom
                jewelry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium">
              3
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-baseblack font-medium mb-2">
                Review & Submit
              </h3>
              <p className="text-baseblack">
                Double-check your details and submit your request for approval.
                We will contact you for confirmation within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container py-12 md:py-16 lg:py-12 2xl:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="p-6">
              <CustomJewelryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
