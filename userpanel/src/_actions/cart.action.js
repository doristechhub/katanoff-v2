import {
  setCartLoading,
  setCartList,
  setSelectedCartItem,
  setProductQuantityHasUpdatedIntoCart,
  setCartMessage,
  setUpdateCartQtyErrorMessage,
  setRemoveCartErrorMessage,
} from "@/store/slices/cartSlice";
import { cartService } from "@/_services";
import { messageType } from "@/_helper/constants";

export const fetchCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      const cartData = await cartService?.getAllCartWithProduct();
      if (cartData) {
        dispatch(setCartList(cartData));
      }
    } catch (e) {
      console.error(e?.message);
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const insertProductIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setCartMessage({ message: "", type: "" }));
      dispatch(setCartLoading(true));
      const createdCartItem = await cartService.insertProductIntoCart(payload);

      if (createdCartItem) {
        dispatch(fetchCart());
        return createdCartItem;
      }
    } catch (err) {
      const errorMessage = err?.message || "Something went wrong";
      dispatch(
        setCartMessage({ message: errorMessage, type: messageType.ERROR })
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const removeProductIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setRemoveCartErrorMessage(""));
      dispatch(setCartLoading(true));

      // Call API
      const isRemovedFromCart = await cartService.removeProductIntoCart(
        payload
      );

      // Handle response
      if (isRemovedFromCart) {
        dispatch(fetchCart()); // Refresh cart after removal
        return true;
      }
    } catch (err) {
      const removeCartErrorMessage = err?.message || "Something went wrong";
      dispatch(setRemoveCartErrorMessage(removeCartErrorMessage));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const handleSelectCartItem = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      dispatch(setSelectedCartItem(payload.selectedCartItem));
    } catch (error) {
      console.error("Error selecting cart item:", error);
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const updateProductQuantityIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUpdateCartQtyErrorMessage(""));
      dispatch(setCartLoading(true));
      dispatch(setProductQuantityHasUpdatedIntoCart(false));

      const isUpdated = await cartService.updateProductQuantityIntoCart(
        payload
      );

      if (isUpdated) {
        dispatch(fetchCart());
        dispatch(setProductQuantityHasUpdatedIntoCart(true));
      }
    } catch (err) {
      console.error("Error updating product quantity:", err);
      dispatch(
        setUpdateCartQtyErrorMessage(err.message || "Something went wrong")
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const insertMultipleProductsIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      const respData = await cartService.insertMultipleProductsIntoCart(
        payload
      );

      if (respData?.createdOrUpdateCartData?.length) {
        return true;
      }
    } catch (err) {
      const errorMessage = err.message || "something went wrong";
    }
  };
};
