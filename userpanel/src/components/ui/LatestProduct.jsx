"use client";
import { fetchLatestProductList } from "@/_actions/product.actions";
import React, { useEffect } from "react";
import { ProductSwiper } from "../dynamiComponents";
import { useDispatch, useSelector } from "react-redux";

export default function LatestProduct() {
  const dispatch = useDispatch();
  const { latestProductList, productLoading } = useSelector(
    ({ product }) => product
  );
  useEffect(() => {
    dispatch(fetchLatestProductList(8));
  }, []);

  return latestProductList && latestProductList.length > 0 ? (
    <ProductSwiper
      productList={latestProductList}
      loading={productLoading}
      title="Latest Products"
    />
  ) : null;
}
