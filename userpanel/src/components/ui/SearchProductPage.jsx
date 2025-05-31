"use client";

import {
  HeroSwiper,
  ProductGrid,
  SwipperHomePageBig,
} from "@/components/dynamiComponents";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchedProducts } from "@/_actions/product.actions";
import { resetFilters, setCurrentPage } from "@/store/slices/productSlice";
import CommonNotFound from "./CommonNotFound";
import { useSearchParams } from "next/navigation";
import searchVector from "@/assets/images/search-vector.webp";
const SearchProductPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { searchedProductList, productLoading } = useSelector(
    ({ product }) => product
  );
  const resultCount = searchedProductList?.length || 0;

  useEffect(() => {
    if (!searchQuery) return;

    dispatch(resetFilters());
    dispatch(setCurrentPage(0));
    dispatch(fetchSearchedProducts({ searchValue: searchQuery }));
  }, [searchQuery]);

  return (
    <>
      <section className="container pt-28 md:pt-18 lg:pt-10 ">
        {searchQuery ? (
          <>
            {!productLoading && (
              <p className="text-center my-6 text-base 2xl:text-lg font-normal">
                {resultCount} Products Matched Your Search
              </p>
            )}
            <ProductGrid
              productsList={searchedProductList}
              pagination={true}
              isLoading={productLoading}
              showFilter={false}
            />
          </>
        ) : (
          <CommonNotFound
            message="Searching for sparkle?"
            notFoundImg={searchVector}
            subMessage="Uncovering your dream jewelry now"
            showButton={false}
          />
        )}
      </section>

      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <SwipperHomePageBig navigation={true} />
      </section>

      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
};

export default SearchProductPage;
