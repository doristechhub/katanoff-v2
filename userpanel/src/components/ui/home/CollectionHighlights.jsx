import readyToShip from "@/assets/images/home/ready-to-ship.webp";
import featuredPicks from "@/assets/images/home/featured-picks.webp";
import markTheMoment from "@/assets/images/home/mark-the-moment.webp";
import CustomImg from "../custom-img";
import { PrimaryLinkButton } from "../button";
import { helperFunctions } from "@/_helper";

const collections = [
  {
    title: "Ready to Ship",
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
            item?.title?.toLowerCase()
          )}`;

          return (
            <div key={idx} className={`relative ${item.span ? item.span : ""}`}>
              <CustomImg
                srcAttr={item.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 text-center text-white">
                <h3 className="uppercase font-gelasio font-normal text-lg lg:text-2xl 2xl:text-3xl mb-4 tracking-[3.5px]">
                  {item.title}
                </h3>
                <PrimaryLinkButton
                  href={href}
                  variant="offWhiteHover"
                  className="!w-fit mx-auto"
                >
                  SHOP NOW
                </PrimaryLinkButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
