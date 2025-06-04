import { setSelectedDiamondInfoModel } from "@/store/slices/commonSlice";
import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import oval from "@/assets/icons/oval.svg";
import round from "@/assets/icons/round.svg";
import pear from "@/assets/icons/pear.svg";
import cushion from "@/assets/icons/cushion.svg";
import emerald from "@/assets/icons/emerald.svg";
import marquise from "@/assets/icons/marquise.svg";
import radiant from "@/assets/icons/radiant.svg";
import asscher from "@/assets/icons/asscher.svg";
import heart from "@/assets/icons/heart.svg";
import princess from "@/assets/icons/princess.svg";
import diamondDiagram from "@/assets/images/customize/diamond-diagram.webp";
import clarityDiagram from "@/assets/images/customize/clarity-diagram.webp";
import diamondColorDiagram from "@/assets/images/customize/diamond-color-diagram.webp";
import { CustomImg } from "@/components/dynamiComponents";

// Base Modal Component
function DiamondInfoModal({ isOpen, title, children, className = "" }) {
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setSelectedDiamondInfoModel(""));
  };
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Apply styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Also add overflow-hidden class as backup
      document.body.classList.add("overflow-hidden");
    }

    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    const handleWheel = (e) => {
      // Prevent wheel scrolling on the background
      if (isOpen && !e.target.closest(".modal-content")) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      // Prevent touch scrolling on mobile
      if (isOpen && !e.target.closest(".modal-content")) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (isOpen) {
        // Get the stored scroll position
        const scrollY = document.body.style.top;

        // Remove the fixed positioning
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        // Remove the class
        document.body.classList.remove("overflow-hidden");

        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }

      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onClose, isOpen]);

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className={`mx-5 md:mx-0 bg-white relative shadow-xl w-full max-w-4xl md:max-w-2xl lg:max-w-3xl p-6 rounded ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
          aria-label="Close modal"
        >
          <RxCross2 />
        </button>

        <div className="flex flex-col items-center text-center text-baseblack">
          {title && <h2 className="text-[22px] font-bold   ">{title}</h2>}
          <div className="h-[1px] my-3 bg-[#EBEBEB] w-[85%]"></div>
        </div>

        <div className="modal-content max-h-[60vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

const diamondShapes = [
  {
    title: "Round",
    image: round,
  },
  {
    title: "Oval",
    image: oval,
  },
  {
    title: "Cushion",
    image: cushion,
  },
  {
    title: "Pear",
    image: pear,
  },
  {
    title: "Emerald",
    image: emerald,
  },
  {
    title: "Marquise",
    image: marquise,
  },
  {
    title: "Radiant",
    image: radiant,
  },
  {
    title: "Asscher",
    image: asscher,
  },
  {
    title: "Heart",
    image: heart,
  },
  {
    title: "Princess",
    image: princess,
  },
];
// Diamond Shape Modal
export function DiamondShapeModal() {
  const { selectedDiamondInfoModel } = useSelector(({ common }) => common);
  const isOpen = selectedDiamondInfoModel === "shape";

  return (
    <DiamondInfoModal isOpen={isOpen} title="Diamond Shape">
      <div className="flex flex-col items-center">
        <p className="leading-relaxed text-xs 2xl:text-sm w-[90%] md:w-[85%] text-center">
          Shape refers to the geometric outline of the stone, as viewed from
          above. The shape often determines the overall style of the finished
          piece of jewelry, but each shape has its own attributes and cut
          specifications. This means that a diamond’s shape can be faceted, or
          cut, in many different ways. There are several shapes and cut
          combinations that appear together, so they have often been given their
          own names, like round, princess, cushion, and marquise.
        </p>
        <div className="grid grid-cols-3 lg:grid-cols-5 py-6 place-items-center gap-5 w-[90%] md:w-[85%]">
          {diamondShapes?.map((shape, index) => {
            return (
              <div
                key={`shape-${index}`}
                className="flex flex-col items-center gap-2"
              >
                <CustomImg srcAttr={shape?.image} className="w-10 h-10" />
                <h5 className="font-semibold text-sm">{shape?.title}</h5>
              </div>
            );
          })}
        </div>
        <CustomImg srcAttr={diamondDiagram} />
      </div>
    </DiamondInfoModal>
  );
}

// Diamond Clarity Modal
export function DiamondClarityModal() {
  const { selectedDiamondInfoModel } = useSelector(({ common }) => common);
  const isOpen = selectedDiamondInfoModel === "clarity";

  return (
    <DiamondInfoModal isOpen={isOpen} title="Diamond Clarity">
      <div className="flex flex-col items-center">
        <p className="leading-relaxed text-xs 2xl:text-sm w-[85%] text-center">
          A diamond’s clarity refers to the presence of impurities on and within
          the stone, called flaws or inclusions. These imperfections form during
          the growing process and are unique to each stone. "Eye clean" diamonds
          have inclusions that generally cannot be seen without magnification
          and are typically graded SI or higher on the clarity scale.
        </p>

        <CustomImg className="mt-4" srcAttr={clarityDiagram} />
      </div>
    </DiamondInfoModal>
  );
}

// Diamond Color Modal
export function DiamondColorModal() {
  const { selectedDiamondInfoModel } = useSelector(({ common }) => common);
  const isOpen = selectedDiamondInfoModel === "color";

  return (
    <DiamondInfoModal isOpen={isOpen} title="Diamond Color">
      <div className="flex flex-col items-center">
        <p className="leading-relaxed text-xs 2xl:text-sm w-[85%] text-center">
          Color is the natural color visible in a diamond and does not change
          over time. Colorless diamonds allow more light to pass through than a
          colored diamond, releasing more sparkle and fire.
        </p>

        <CustomImg className="mt-4" srcAttr={diamondColorDiagram} />
      </div>
    </DiamondInfoModal>
  );
}
