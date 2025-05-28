"use client";
import { useState, useEffect, useRef, useCallback, memo, use } from "react";
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
import { ProgressiveImg } from "@/components/dynamiComponents";
import CommonNotFound from "@/components/ui/CommonNotFound";
import searchVector from "@/assets/images/search-vector.webp";
import Link from "next/link";

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
          className="bg-white p-2"
        >
          <div className="aspect-square mb-2">
            <ProgressiveImg
              src={product?.thumbnailImage || product?.images?.[0]?.image}
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
    transparenHeadertBg,
  } = useSelector(({ common }) => common);
  const { searchedProductList, productLoading } = useSelector(
    ({ product }) => product
  );

  // Increase debounce delay to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const abortControllerRef = useRef(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Cache for search results to prevent unnecessary API calls
  const searchCache = useRef(new Map());

  const openSearch = useCallback(
    () => dispatch(setIsSearchOpen(true)),
    [dispatch]
  );
  const closeSearch = useCallback(
    () => dispatch(setIsSearchOpen(false)),
    [dispatch]
  );

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
        dispatch(setIsShowingResults(false));
        dispatch(setIsMobileSearchOpen(false));
        dispatch(setCurrentPage(0));
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

    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const fetchResults = async () => {
      setLocalLoading(true);
      try {
        const results = await dispatch(
          fetchSearchedProducts({
            searchValue: debouncedSearchQuery,
            signal: abortControllerRef.current.signal,
          })
        );

        // Store in cache (limit cache size to prevent memory issues)
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

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [debouncedSearchQuery, dispatch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lastScrollY < 50 &&
        searchContainerRef?.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        closeSearch();
      }
      if (
        lastScrollY < 50 &&
        resultsContainerRef?.current &&
        !resultsContainerRef.current.contains(event.target) &&
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

    if (searchedProductList?.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No products found</p>
        </div>
      );
    }

    return (
      <div className="max-h-64 overflow-y-auto border-t border-gray-100">
        {searchedProductList.slice(0, 5).map((product) => (
          <SearchResultItem
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
        <div
          className="p-3 bg-gray-50 text-center cursor-pointer"
          onClick={handleSearchSubmit}
        >
          <p className="text-sm font-medium text-primary">See all results</p>
        </div>
      </div>
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
          className={`absolute right-5 -top-2 z-50  ${
            transparenHeadertBg && !isHeaderVisible ? "bg-offwhite" : "bg-white"
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
              className={`w-full py-1 px-2 text-sm focus:outline-none  ${
                transparenHeadertBg && !isHeaderVisible
                  ? "bg-offwhite"
                  : "bg-white"
              }`}
              value={searchQuery}
              onChange={handleInputChange}
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
            aria-expanded={isMobileSearchOpen}
          >
            <IoIosSearch className="text-xl" />
          </button>
        ) : null}
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <div className="lg:hidden container border-t border-gray-200 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="flex flex-col">
            <div className="flex items-center px-2 h-12">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-search"
                ref={mobileSearchInputRef}
                type="search"
                placeholder="Search products..."
                className="w-full h-full py-2 px-3 text-sm focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={handleInputChange}
                aria-label="Search products"
              />
              <button
                type="submit"
                className="px-2"
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
            {renderMobileSearchResults()}
          </form>
        </div>
      )}

      {/* Desktop Search Results */}
      {isShowingResults && !isMobile && (
        <div
          ref={resultsContainerRef}
          className={`${
            lastScrollY > 100
              ? "top-[54px] h-[calc(100vh-54px)]"
              : "top-[160px] h-[calc(100vh-160px)]"
          } fixed left-0 w-full bg-offwhite shadow-lg overflow-hidden z-40 hidden lg:block`}
          style={{
            overflowY: "auto",
            willChange: "transform", // Optimization for animations
          }}
        >
          <div className="container mx-auto flex flex-col h-full">
            <p className="text-center my-6 text-base 2xl:text-lg font-normal">
              {searchedProductList?.length || 0} Products Matched Your Search
            </p>
            <div className="flex-1 px-2 pb-6">
              {localLoading || productLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">Loading results...</p>
                </div>
              ) : searchedProductList?.length > 0 ? (
                <SimpleProductGrid
                  products={searchedProductList.slice(0, 15)}
                />
              ) : (
                <CommonNotFound
                  message="Searching for sparkle?"
                  notFoundImg={searchVector}
                  subMessage="No matching products found. Try another search term."
                  showButton={false}
                />
              )}

              {searchedProductList?.length > 15 && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleSearchSubmit}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    View All {searchedProductList.length} Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
