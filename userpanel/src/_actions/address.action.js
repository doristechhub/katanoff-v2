import {
  setAddressLoading,
  setAddressList,
  setAddressLoader,
  setAddressMessage,
  setInvalidAddressDetail,
  setValidateAddressLoader,
} from "@/store/slices/addressSlice";
import { addressService } from "@/_services";
import { messageType } from "@/_helper/constants";

// // Fetch all addresses
// export const fetchAddressList = () => {
//   return async (dispatch) => {
//     try {
//       dispatch(setAddressLoading(true));
//       const addressList = await addressService.getAddressListByUserId();
//       dispatch(setAddressList(addressList || []));
//     } catch (error) {
//       console.error("Fetch address list error:", error);
//       dispatch(setAddressList([]));
//     } finally {
//       dispatch(setAddressLoading(false));
//     }
//   };
// };

// // Add new address
// export const addNewAddress = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch(setAddUpdateAddressError(""));
//       dispatch(setAddressLoader(true));

//       const response = await addressService.addNewAddress(payload);
//       if (response) {
//         toasterService.success("Address added successfully!");
//         return true;
//       }
//     } catch (error) {
//       const msg = error?.message || "Something went wrong";
//       dispatch(setAddUpdateAddressError(msg));
//       return false;
//     } finally {
//       dispatch(setAddressLoader(false));
//     }
//   };
// };

// // Update address
// export const updateAddress = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch(setAddUpdateAddressError(""));
//       dispatch(setAddressLoader(true));

//       const response = await addressService.updateAddress(payload);
//       if (response) {
//         toasterService.success("Address updated successfully!");
//         return true;
//       }
//     } catch (error) {
//       const msg = error?.message || "Something went wrong";
//       dispatch(setAddUpdateAddressError(msg));
//       return false;
//     } finally {
//       dispatch(setAddressLoader(false));
//     }
//   };
// };

// // Delete address
// export const deleteAddress = (addressId) => {
//   return async (dispatch) => {
//     try {
//       dispatch(setDeleteAddressError(""));
//       dispatch(setAddressLoader(true));

//       const response = await addressService.deleteAddress(addressId);
//       if (response) {
//         toasterService.success("Address deleted successfully!");
//         return true;
//       }
//     } catch (error) {
//       const msg = error?.message || "Something went wrong";
//       dispatch(setDeleteAddressError(msg));
//       return false;
//     } finally {
//       dispatch(setAddressLoader(false));
//     }
//   };
// };

// Set invalid address message
export const handleAddressMessage = (payload) => (dispatch) => {
  dispatch(setAddressMessage(payload));
};

export const handleInvalidAddressDetail = (details) => {
  return (dispatch) => {
    dispatch(setInvalidAddressDetail(details.setInvalidAddressDetail));
  };
};

export const validateAddress = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setValidateAddressLoader(true));
      dispatch(setAddressMessage({ message: "", type: "" })); // optional: clear previous

      const result = await addressService.validateAddress(
        payload,
        abortController
      );
      return result;
    } catch (error) {
      const msg =
        error?.code === "ERR_NETWORK"
          ? "Network error occurred while validating address."
          : "Something went wrong while validating the address.";

      dispatch(
        setAddressMessage({
          message: msg,
          type: messageType.ERROR,
        })
      );

      return false;
    } finally {
      dispatch(setValidateAddressLoader(false));
    }
  };
};
