"use client";
import { fetchCart } from "@/_actions/cart.action";
import Link from "next/link";
import { useEffect } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

const CartIconInCheckout = () => {
  const dispatch = useDispatch();
  const { cartList } = useSelector(({ cart }) => cart);

  useEffect(() => {
    if (!cartList.length) {
      dispatch(fetchCart());
    }
  }, [cartList.length, dispatch]);  

  return (
    <Link href="/cart">
      <button aria-label="Open cart" className="relative">
        <HiOutlineShoppingBag className="text-xl" />
        {cartList?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {cartList.length}
          </span>
        )}
      </button>
    </Link>
  );
};

export default CartIconInCheckout;
