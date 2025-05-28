"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomImg } from "../dynamiComponents";

export default function ReviewSlider({ reviews = [], totalCount = 0 }) {
  return (
    <section className="pb-6 md:pb-10 pt-16 container">
      {/* Header Row */}
      <div className="flex justify-between items-center border-b">
        <h3 className="text-sm font-semibold">
          Real Reviews From Real Customers
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span>{totalCount} Reviews</span>

          <div className="flex items-center gap-1">
            <button className="swiper-prev text-black hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="swiper-next text-black hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        slidesPerView={3}
        slidesPerGroup={1}
        loop={true}
        speed={600}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mt-6"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="text-sm gap-2 flex flex-col">
              <div className="flex items-center gap-2">
                <CustomImg
                  srcAttr={review.starImage}
                  altAttr="Star"
                  className="w-16 h-auto"
                />
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
              <p className="font-semibold">{review.title}</p>
              <p className=" w-[70%]">{review.content}</p>
              <p className="font-bold">{review.author}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
