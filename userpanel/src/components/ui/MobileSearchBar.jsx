"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import {
  setIsMobileSearchOpen,
  setSearchQuery,
  setIsShowingResults,
  setIsSearchOpen,
} from "@/store/slices/commonSlice";
import {
  setCurrentPage,
  setSearchedProductList,
} from "@/store/slices/productSlice";
import { HeaderLinkButton } from "./button";
import { ProductNotFound, SimpleProductGrid } from "@/components/dynamiComponents";
import Spinner from "./spinner";
import { useRouter } from "next/navigation";

export default function MobileSearchBar({ mobileSearchInputRef }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isMobileSearchOpen, searchQuery } = useSelector(
    ({ common }) => common
  );
  const { searchedProductList, productLoading } = useSelector(
    ({ product }) => product
  );

  const toggleSearch = () => {
    if (isMobileSearchOpen) {
      dispatch(setIsMobileSearchOpen(false));
      dispatch(setSearchQuery(""));
      dispatch(setSearchedProductList([]));
      dispatch(setIsShowingResults(false));
    } else {
      dispatch(setIsMobileSearchOpen(true));
    }
  };

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

  return (
    <>
      {/* Search icon inside header */}
      <button
        onClick={toggleSearch}
        className="lg:hidden"
        aria-label="Toggle mobile search"
      >
        <IoIosSearch className="text-2xl" />
      </button>

      {/* Expanding search bar below header */}
      {isMobileSearchOpen && (
        <div className="absolute left-0 right-0 top-full bg-white shadow-md border-t z-50 animate-slideDown">
          <div className="container py-3 relative flex items-center">
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search Katanoff"
              className="w-full py-2 px-3 text-sm focus:outline-none border rounded"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button
              onClick={toggleSearch}
              className="absolute right-7 text-xl"
              aria-label="Close search"
            >
              <IoCloseOutline />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-[70vh] overflow-y-auto border-t">
            {productLoading ? (
              <div className="h-[40vh] flex justify-center items-center">
                <Spinner />
              </div>
            ) : searchedProductList?.length ? (
              <div className="p-3">
                <SimpleProductGrid products={searchedProductList.slice(0, 6)} />
                {searchedProductList.length > 6 && (
                  <div className="text-center py-3">
                    <HeaderLinkButton
                      onClick={handleSearchSubmit}
                      className="capitalize underline"
                    >
                      See {searchedProductList.length} more results for :{" "}
                      {searchQuery}
                    </HeaderLinkButton>
                  </div>
                )}
              </div>
            ) : searchQuery ? (
              <ProductNotFound />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
