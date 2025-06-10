"use client";

import { ProductGrid, SwipperHomePageBig } from "@/components/dynamiComponents";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchedProducts } from "@/_actions/product.actions";
import {
  resetFilters,
  setCurrentPage,
  setSearchResults,
} from "@/store/slices/productSlice";
import CommonNotFound from "./CommonNotFound";
import { useSearchParams } from "next/navigation";
import searchVector from "@/assets/images/search-vector.webp";

const SearchProductPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { searchResults, productLoading } = useSelector(
    ({ product }) => product
  );
  const resultCount = searchResults?.length || 0;

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(setCurrentPage(0));
    const fetchResults = async () => {
      try {
        dispatch(setSearchResults([]));
        const results = await dispatch(
          fetchSearchedProducts({
            searchValue: searchQuery,
          })
        );
        dispatch(setSearchResults(results));
      } catch (error) {}
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <>
      <section className="container pt-10 md:pt-3 lg:pt-6">
        {searchQuery ? (
          <>
            {!productLoading && resultCount ? (
              <p className="text-center my-6 text-base 2xl:text-lg font-normal">
                {resultCount} Products Matched Your Search
              </p>
            ) : null}
            <ProductGrid
              productsList={searchResults}
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
