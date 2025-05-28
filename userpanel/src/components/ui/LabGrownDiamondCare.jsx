import Image from "next/image";
import img from "@/assets/images/education/diamond-cleaning.webp";
import img1 from "@/assets/images/education/diamond-on-fabric.webp";
const LabGrownDiamondCare = () => {
  return (
    <div className="container py-8 lg:py-12 2xl:py-20 ">
      <div className="text-center mb-10">
        <h2 className="text-2xl xss:text-3xl md:text-4xl font-medium mb-3 font-chong-modern text-baseblack">
          How to Care for Lab-Grown Diamonds
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium max-w-3xl mx-auto">
          Caring for lab-grown diamonds is the same as caring for natural
          diamonds, to maintain their brilliance.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 lg:gap-20">
        <div className="md:w-1/2 flex flex-col items-center md:items-start md:text-left">
          <Image
            src={img?.src}
            alt="Diamond cleaning"
            width={800}
            height={600}
            className="shadow-md w-full max-w-[900px] object-cover "
          />

          <ul className="mt-4 flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-xs xss:text-sm sm:text-base md:text-[17px] lg:text-sm xl:text-lg text-gray-800 list-disc list-outside pl-5 max-w-2xl">
            <li className="md:w-auto">
              Clean regularly with warm, soapy water and a soft brush.
            </li>
            <li className="md:w-auto">Store separately to avoid scratches.</li>
            <li className="md:w-auto">
              Have them professionally cleaned and checked periodically.
            </li>
          </ul>
        </div>

        <div className="md:w-1/2 flex justify-center mt-8 md:mt-20">
          <Image
            src={img1?.src}
            alt="Diamond on fabric"
            width={600}
            height={800}
            className="shadow-md object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-xl px-0 py-0"
          />
        </div>
      </div>
    </div>
  );
};

export default LabGrownDiamondCare;
