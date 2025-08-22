import contactus from "@/assets/images/contact-us/contact.webp";
import { CustomJewelryForm, HeroBanner } from "../dynamiComponents";

export default function CustomJewelry() {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          imageSrc={contactus}
          title="  Custom Jewelry"
          description="  We're here to help – reach out anytime!"
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />
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
