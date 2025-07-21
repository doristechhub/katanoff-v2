"use client";

import { ProductFilter, ProductGrid } from "@/components/dynamiComponents";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchedProducts,
  getUniqueFilterOptions,
} from "@/_actions/product.actions";
import {
  resetFilters,
  setCurrentPage,
  setSearchResults,
  setUniqueFilterOptions,
} from "@/store/slices/productSlice";
import CommonNotFound from "./CommonNotFound";
import { useSearchParams } from "next/navigation";
import searchVector from "@/assets/images/search-vector.webp";

const SearchProductPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { searchResults, productLoading, filteredProducts } = useSelector(
    ({ product }) => product
  );
  const resultCount = searchResults?.length || 0;

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(setCurrentPage(0));
    const fetchResults = async () => {
      try {
        const result = await dispatch(
          fetchSearchedProducts({
            searchValue: searchQuery,
          })
        );
        const tempUniqueFilterOptions = getUniqueFilterOptions(result);
        dispatch(setSearchResults(result));
        dispatch(setUniqueFilterOptions(tempUniqueFilterOptions));
      } catch (error) {
        dispatch(setSearchResults([]));
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <>
      <section className="lg:pt-4">
        {searchQuery ? (
          <>
            {!productLoading && resultCount ? (
              <p className="text-center my-6 text-base 2xl:text-lg font-normal">
                {resultCount} Products Matched Your Search
              </p>
            ) : null}
            {searchResults?.length ? (
              <section className="pt-6 2xl:pt-10">
                <ProductFilter productList={searchResults} />
              </section>
            ) : null}
            <div className="container mt-8">
              <ProductGrid
                productsList={filteredProducts}
                pagination={true}
                isLoading={productLoading}
              />
            </div>
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
        <KeyFeatures />
      </section>
    </>
  );
};

export default SearchProductPage;
