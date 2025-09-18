import readyToShip from "@/assets/images/home/ready-to-ship.webp";
import featuredPicks from "@/assets/images/home/featured-picks.webp";
import markTheMoment from "@/assets/images/home/mark-the-moment.webp";
import CustomImg from "../custom-img";
import { helperFunctions, PAGE_CONSTANTS } from "@/_helper";
import Link from "next/link";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";

const collections = [
  {
    title: "Ready to Ship Gifts",
    image: readyToShip,
    span: "row-span-2",
  },
  {
    title: "Featured Picks",
    image: featuredPicks,
  },
  {
    title: "Mark the Moment",
    image: markTheMoment,
  },
];

export default function CollectionHighlights() {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((item, idx) => {
          const href = `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
            item.title.toLowerCase()
          )}`;

          return (
            <div key={idx} className={`relative ${item.span ? item.span : ""}`}>
              <CustomImg
                srcAttr={item.image}
                altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
                titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 text-center w-full  text-white">
                <h3 className="uppercase  w-full font-gelasio font-normal text-lg lg:text-xl 2xl:text-2xl 4xl:text-3xl mb-1 lg:mb-3 tracking-[3.5px]">
                  {item.title}
                </h3>
                <Link
                  href={href}
                  className="font-medium text-white underline decoration-white underline-offset-4  inline-block"
                >
                  SHOP NOW
                </Link>
                {/* <PrimaryLinkButton
                  href={href}
                  variant="offWhiteHover"
                  className="!w-fit mx-auto"
                >
                  SHOP NOW
                </PrimaryLinkButton> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
