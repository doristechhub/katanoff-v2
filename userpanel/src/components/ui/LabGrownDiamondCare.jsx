import img from "@/assets/images/education/diamond-cleaning.webp";
import img1 from "@/assets/images/education/diamond-on-fabric.webp";
import CustomImg from "./custom-img";

const LabGrownDiamondCare = () => {
  return (
    <div className="container py-8 lg:py-12 2xl:py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl xss:text-3xl md:text-4xl font-medium mb-3 font-gelasio text-baseblack">
          Protect What You Treasure
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium max-w-3xl mx-auto">
          Keep your lab-grown diamond jewelry shining with simple, thoughtful
          care and regular cleaning.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 lg:gap-20">
        <div className="md:w-1/2 flex flex-col items-center md:items-start md:text-left">
          <CustomImg
            srcAttr={img?.src}
            altAttr={
              "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
            }
            titleAttr={
              "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
            }
            width={800}
            height={600}
            className="shadow-md w-full max-w-[900px] object-cover "
          />

          <ul className="mt-6 flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-xs xss:text-sm sm:text-base md:text-[17px] lg:text-sm xl:text-lg text-gray-800 list-disc list-outside pl-5 max-w-2xl">
            <li className="md:w-auto">
              Use mild soap, warm water, and a soft brush to keep diamonds
              sparkling.
            </li>
            <li className="md:w-auto">
              Remove jewelry when using cleaning agents, perfumes, or lotions to
              prevent buildup or damage.
            </li>
            <li className="md:w-auto">
              Keep your pieces in a soft pouch or lined box to avoid scratches
              and tangling.
            </li>
            <li className="md:w-auto">
              Take off your jewelry during intense activities, workouts, or
              heavy lifting to protect settings.
            </li>
          </ul>
        </div>

        <div className="md:w-1/2 flex justify-center mt-8 md:mt-20">
          <CustomImg
            srcAttr={img1?.src}
            altAttr={
              "lab grown diamond close-up, ethical diamond jewelry, sustainable fine jewelry, custom jewelry New York, Katanoff"
            }
            titleAttr={
              "Katanoff | Lab Grown Diamond Detail – Ethical Luxury Jewelry"
            }
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
