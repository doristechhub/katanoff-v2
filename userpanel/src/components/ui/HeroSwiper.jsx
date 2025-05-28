"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { CustomImg } from "../dynamiComponents";

export default function HeroSwiper({ slides }) {
  return (
    <section className="pt-20 md:pt-10 lg:pt-4 2xl:pt-6">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        slidesPerView={1}
        loop={true}
        className="w-full h-auto"
      >
        {slides?.length
          ? slides.map((slide, index) => (
              <SwiperSlide key={`slides-${index}`}>
                <div className="relative w-full">
                  <CustomImg
                    srcAttr={slide.image}
                    className="h-[30vh] lg:h-auto object-cover lg:object-contain"
                  />
                  <div className="absolute inset-0 grid lg:grid-cols-2 place-items-center bg-black  bg-opacity-5 items-center justify-center  text-white text-center p-4">
                    <div className="md:w-[70%]">
                      <h2 className="text-2xl lg:text-4xl 2xl:text-6xl font-castoro mb-3 lg:mb-5">
                        {slide.title}
                      </h2>
                      <p className="text-base 2xl:text-lg">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          : null}
      </Swiper>
    </section>
  );
}
