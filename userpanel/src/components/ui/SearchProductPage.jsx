"use client";
import {
  HeroSwiper,
  ProductGrid,
  SwipperHomePageBig,
} from "@/components/dynamiComponents";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import slide1 from "@/assets/images/collections/slide-1.webp";
import slide2 from "@/assets/images/collections/slide-2.webp";
import slide3 from "@/assets/images/collections/slide-3.webp";
import { fetchSearchedProducts } from "@/_actions/product.actions";
import { IoIosSearch } from "react-icons/io";
import searchVector from "@/assets/images/search-vector.webp";
import {
  resetFilters,
  setCurrentPage,
  setSearchedProductList,
} from "@/store/slices/productSlice";
import CommonNotFound from "./CommonNotFound";

export const searchSwiper = [
  {
    image: slide1,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide2,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide3,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
];

const SearchProductPage = () => {
  const dispatch = useDispatch();
  const { searchedProductList, productLoading } = useSelector(
    ({ product }) => product
  );
  const resultCount = searchedProductList?.length || 0;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (val) => {
      setSearchQuery(val);
      dispatch(setCurrentPage(0));

      if (!val) {
        dispatch(setSearchedProductList([]));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(resetFilters());
    const getData = setTimeout(() => {
      if (searchQuery) {
        dispatch(fetchSearchedProducts({ searchValue: searchQuery }));
      }
    }, 500); //half a second delay

    return () => clearTimeout(getData);
  }, [searchQuery, dispatch]);

  return (
    <>
      <HeroSwiper slides={searchSwiper} />

      <section className="container py-10">
        <h1 className="text-2xl font-chong-modern text-center m-8 relative after:absolute after:content-[''] after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-10 after:h-[2px] after:bg-primary">
          Search Product
        </h1>

        <div className="flex justify-center mb-6 px-0">
          <div className="container relative">
            <IoIosSearch className="absolute top-1/2 left-6  md:left-8 transform -translate-y-1/2 text-basegray text-xl pointer-events-none" />

            <input
              type="text"
              placeholder="Search Products By Name, Category, SKU, or Variations"
              className="custom-input ml-2 !pl-10 md:pl-12 pr-10 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg focus:outline-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {searchQuery && !productLoading ? (
          <p className="text-center text-md text-gray-500 mt-2">
            {resultCount} Result{resultCount !== 1 && "s"} for “{searchQuery}”
          </p>
        ) : null}
      </section>

      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        {searchQuery ? (
          <ProductGrid
            productList={searchedProductList}
            pagination={true}
            isLoading={productLoading}
            showFilter={false}
          />
        ) : (
          <CommonNotFound
            message="Searching for sparkle?"
            notFoundImg={searchVector}
            subMessage="Uncovering your dream jewelry now"
            showButton={false}
          />
        )}
      </section>

      <section className="pt-16 lg:pt-20 2xl:pt-20">
        <SwipperHomePageBig navigation={true} />
      </section>

      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
};

export default SearchProductPage;
