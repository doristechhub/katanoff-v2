"use client";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";
export default function ReviewSlider({ reviews = [], totalCount = 0 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef(null);

  const getSlidesPerView = () => {
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };

  const totalPages = Math.ceil(reviews.length / getSlidesPerView());

  return (
    <section className="py-20 container">
      <div className="text-center mb-12">
        <h3 className="text-base md:text-lg font-bold text-[#BE944B] uppercase">
          Testimonials
        </h3>
        <h2 className="text-2xl md:text-3xl lg:text-4xl italic font-medium mt-3 font-castoro">
          WHAT CLIENTS SAY ABOUT OUR WORK
        </h2>
        <p className="mt-3 text-sm text-gray-500">Our 100+ People Trust Us</p>
      </div>

      {/* Swiper */}
      <div className="px-6  mx-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1240: { slidesPerView: 4 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const activeIndex = swiper.activeIndex;
            const perPage =
              typeof swiper.params.slidesPerView === "number"
                ? swiper.params.slidesPerView
                : 4;
            setCurrentPage(Math.floor(activeIndex / perPage));
          }}
        >
          {reviews.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl p-6 h-[300px] flex flex-col gap-8 shadow-lg">
                <div className="pt-4 xl:pt-5">
                  <h4 className="font-semibold text-lg mb-2">{item.author}</h4>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) =>
                      i < item.rating ? (
                        <FaStar key={i} size={16} className="text-[#B58C08]" />
                      ) : (
                        <FaStar key={i} size={16} className="text-black" />
                      )
                    )}
                  </div>
                </div>
                <p className="text-sm md:text-base text-[#6B6B6B] leading-relaxed line-clamp-5">
                  {item.content}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const perPage = getSlidesPerView();
              swiperRef.current?.slideTo(i * perPage);
              setCurrentPage(i);
            }}
            className={`w-3 h-3 rounded-full ${
              currentPage === i ? "bg-primary" : "bg-gray-300"
            } transition-all duration-300`}
          />
        ))}
      </div>
    </section>
  );
}
