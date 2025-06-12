"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { fetchSearchedProducts } from "@/_actions/product.actions";
import {
  setIsSearchOpen,
  setIsMobileSearchOpen,
  setIsShowingResults,
  setIsMenuOpen,
  setSearchQuery,
} from "@/store/slices/commonSlice";
import {
  setCurrentPage,
  setSearchedProductList,
} from "@/store/slices/productSlice";
import { helperFunctions } from "@/_helper";
import { ProductNotFound, ProgressiveImg } from "@/components/dynamiComponents";
import Link from "next/link";
import { HeaderLinkButton } from "./button";
import { IoCloseOutline } from "react-icons/io5";

// Memoized search result item component to prevent unnecessary re-renders
const SearchResultItem = memo(({ product, onClick }) => (
  <div
    className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
    onClick={() => onClick(product)}
  >
    {product?.yellowGoldThumbnailImage && (
      <div className="w-12 h-12 flex-shrink-0 mr-4">
        <ProgressiveImg
          src={product?.yellowGoldThumbnailImage}
          alt={product?.productName}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="flex-1">
      <p className="text-sm font-medium">{product?.productName}</p>
      <p className="text-xs text-gray-500">${product?.baseSellingPrice}</p>
    </div>
  </div>
));

SearchResultItem.displayName = "SearchResultItem";

// Optimized version of the ProductGrid specifically for search results
const SimpleProductGrid = memo(({ products }) => {
  const dispatch = useDispatch();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5 lg:gap-4">
      {products.map((product) => (
        <Link
          href={`/products/${helperFunctions.stringReplacedWithUnderScore(
            product?.productName
          )}`}
          onClick={() => {
            dispatch(setIsShowingResults(false));
            dispatch(setIsMobileSearchOpen(false));
            dispatch(setSearchQuery(""));
            dispatch(setSearchedProductList([]));
          }}
          key={product.id}
        >
          <div className="p-2 aspect-square mb-2 border border-[#80808021]">
            <ProgressiveImg
              src={product?.yellowGoldThumbnailImage}
              alt={product?.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium truncate">{product?.productName}</p>
          <p className="text-xs text-gray-500">${product?.baseSellingPrice}</p>
        </Link>
      ))}
    </div>
  );
});

SimpleProductGrid.displayName = "SimpleProductGrid";

// Improved debounce hook with proper cleanup
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default function SearchBar({
  isMobile = false,
  searchContainerRef,
  resultsContainerRef,
  navSearchInputRef,
  mobileSearchInputRef,
  lastScrollY,
  isHeaderVisible,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isSearchOpen,
    isMobileSearchOpen,
    isShowingResults,
    searchQuery,
    transparentHeaderBg,
  } = useSelector(({ common }) => common);
  const { searchedProductList, productLoading } = useSelector(
    ({ product }) => product
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const [localLoading, setLocalLoading] = useState(false);
  const searchCache = useRef(new Map());

  const openSearch = useCallback(() => {
    dispatch(setIsSearchOpen(true));
  }, [dispatch]);

  const closeSearch = useCallback(() => {
    dispatch(setIsSearchOpen(false));
  }, [dispatch]);

  const handleProductClick = useCallback(
    (product) => {
      router.push(
        `/products/${helperFunctions.stringReplacedWithUnderScore(
          product?.productName
        )}`
      );
    },
    [dispatch, router]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      dispatch(setSearchQuery(value));

      if (!value) {
        dispatch(setIsShowingResults(false));
        dispatch(setSearchedProductList([]));
      }
    },
    [dispatch]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (searchQuery) {
        dispatch(setSearchQuery(""));
        dispatch(setIsSearchOpen(false));
        dispatch(setIsMobileSearchOpen(false));
        dispatch(setIsShowingResults(false));
        dispatch(setCurrentPage(0));
        dispatch(setSearchedProductList([]));
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, dispatch, router]
  );

  // Optimized fetch function with caching
  useEffect(() => {
    if (!debouncedSearchQuery) {
      dispatch(setSearchedProductList([]));
      dispatch(setIsShowingResults(false));
      return;
    }

    // Check cache first
    if (searchCache.current.has(debouncedSearchQuery)) {
      dispatch(
        setSearchedProductList(searchCache.current.get(debouncedSearchQuery))
      );
      dispatch(setIsShowingResults(true));
      return;
    }

    const fetchResults = async () => {
      setLocalLoading(true);
      try {
        const results = await dispatch(
          fetchSearchedProducts({
            searchValue: debouncedSearchQuery,
          })
        );

        if (searchCache.current.size > 20) {
          const firstKey = searchCache.current.keys().next().value;
          searchCache.current.delete(firstKey);
        }
        searchCache.current.set(debouncedSearchQuery, results);

        dispatch(setSearchedProductList(results));
        dispatch(setIsShowingResults(true));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search failed:", error);
          dispatch(setIsShowingResults(false));
          dispatch(setSearchedProductList([]));
        }
      } finally {
        setLocalLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchQuery, dispatch]);

  // Updated click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lastScrollY < 50 &&
        resultsContainerRef?.current &&
        !resultsContainerRef?.current?.contains(event.target) &&
        !searchContainerRef?.current?.contains(event.target)
      ) {
        dispatch(setIsShowingResults(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    lastScrollY,
    dispatch,
    closeSearch,
    searchContainerRef,
    resultsContainerRef,
  ]);

  // Autofocus input
  useEffect(() => {
    if (lastScrollY < 50 && isSearchOpen && navSearchInputRef?.current) {
      navSearchInputRef.current.focus();
    }
  }, [isSearchOpen, lastScrollY, navSearchInputRef]);

  useEffect(() => {
    if (
      lastScrollY < 50 &&
      isMobileSearchOpen &&
      mobileSearchInputRef?.current
    ) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen, lastScrollY, mobileSearchInputRef]);

  // Render functions to improve readability
  const renderMobileSearchResults = useCallback(() => {
    if (!searchQuery) return null;

    if (localLoading || productLoading) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">Searching...</p>
        </div>
      );
    }

    if (!searchedProductList?.length && !productLoading) {
      return (
        <div className="py-6 bg-white">
          {" "}
          <ProductNotFound />
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col h-full">
          {searchedProductList?.length ? (
            <p className={`text-center mb-6 text-sm `}>
              {searchedProductList?.length || 0} Products Matched Your Search
            </p>
          ) : null}

          <div className="flex-1 px-2 pb-6 max-h-[50vh] overflow-y-auto">
            {localLoading || productLoading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading results...</p>
              </div>
            ) : searchedProductList?.length ? (
              <div className="container">
                {" "}
                <SimpleProductGrid products={searchedProductList.slice(0, 6)} />
              </div>
            ) : (
              <ProductNotFound />
            )}
          </div>
          {searchedProductList?.length > 6 ? (
            <div className="text-center bg-offwhite py-3">
              <HeaderLinkButton
                onClick={handleSearchSubmit}
                className="capitalize hover:underline"
              >
                See {searchedProductList.length} more results for :{" "}
                {searchQuery}
              </HeaderLinkButton>
            </div>
          ) : null}
        </div>
      </>
    );
  }, [
    searchQuery,
    localLoading,
    productLoading,
    searchedProductList,
    handleProductClick,
    handleSearchSubmit,
  ]);

  return (
    <>
      {/* Desktop Search Icon + Input */}
      <div
        ref={searchContainerRef}
        className={`relative flex items-center ${
          isMobile ? "lg:hidden" : "hidden lg:flex"
        }`}
        onMouseEnter={!isMobile ? openSearch : undefined}
        onMouseLeave={!isMobile ? closeSearch : undefined}
      >
        <div
          className={`absolute right-5 -top-2 z-50 ${
            transparentHeaderBg && !isHeaderVisible ? "bg-offwhite" : "bg-white"
          } hidden lg:flex items-center overflow-hidden transition-all duration-300 ease-in-out border-b border-transparent ${
            isSearchOpen ? "w-48 !border-gray-300" : "w-0"
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              id="desktop-search"
              ref={navSearchInputRef}
              type="search"
              placeholder="Search..."
              className={`w-full py-1 px-2 text-sm focus:outline-none ${
                transparentHeaderBg && !isHeaderVisible
                  ? "bg-offwhite"
                  : "bg-white"
              }`}
              value={searchQuery}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              aria-label="Search products"
            />
          </form>
        </div>
        {!isMobile ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setIsMenuOpen(false));
            }}
            className="relative z-10"
            aria-label="Toggle search"
          >
            <IoIosSearch className="text-xl" />
          </button>
        ) : null}
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <div className="lg:hidden  border-t border-gray-200 shadow-[0_5px_5px_0_rgba(0,0,0,0.21)]">
          <form onSubmit={handleSearchSubmit} className="flex flex-col">
            <div className="flex items-center container relative h-7  my-4">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-search"
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full  py-1.5 px-2 text-sm focus:outline-none bg-transparent border focus:border-primary pe-12"
                value={searchQuery}
                onChange={handleInputChange}
                aria-label="Search products"
              />
              <div className="absolute right-6 text-xl flex gap-2 bg-white">
                {searchQuery?.length ? (
                  <IoCloseOutline
                    onClick={() => dispatch(setSearchQuery(""))}
                  />
                ) : null}

                <button
                  type="submit"
                  onClick={handleSearchSubmit}
                  disabled={localLoading || productLoading}
                  aria-label="Submit search"
                >
                  <IoIosSearch
                    className={`text-xl ${
                      localLoading || productLoading ? "opacity-50" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            {renderMobileSearchResults()}
          </form>
        </div>
      )}

      {/* Desktop Search Results */}
      {isShowingResults && !isMobile && (
        <div
          ref={resultsContainerRef}
          className={`${
            lastScrollY > 50
              ? "top-[54px] h-[calc(100vh-54px)]"
              : "top-[162px] h-[calc(100vh-162px)] opacity-0 translate-y-6 animate-enter"
          }
          fixed left-0 w-full bg-white shadow-lg overflow-y-auto z-40
          hidden lg:block
          transition-all duration-400 ease-in-out
        `}
        >
          <div className="container mx-auto flex flex-col h-full">
            {searchedProductList?.length ? (
              <p
                className={`text-center mb-6 ${
                  lastScrollY > 50 ? "mt-6" : "mt-12"
                } text-base 2xl:text-lg font-normal`}
              >
                {searchedProductList?.length || 0} Products Matched Your Search
              </p>
            ) : null}

            <div className="flex-1 px-2 pb-6">
              {localLoading || productLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">Loading results...</p>
                </div>
              ) : searchedProductList?.length ? (
                <SimpleProductGrid
                  products={searchedProductList.slice(0, 15)}
                />
              ) : (
                <ProductNotFound />
              )}

              {searchedProductList?.length > 15 ? (
                <div className="text-center mt-6">
                  <HeaderLinkButton
                    onClick={handleSearchSubmit}
                    className="capitalize hover:underline"
                  >
                    See {searchedProductList.length} more results for :{" "}
                    {searchQuery}
                  </HeaderLinkButton>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
