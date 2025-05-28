import { uid } from "uid";
import {
  apiUrl,
  fetchWrapperService,
  helperFunctions,
  sanitizeObject,
  sanitizeValue,
} from "../_helper";
import axios from "axios";

const addressUrl = process.env.NEXT_PUBLIC_ADDRESS;
const userUrl = process.env.NEXT_PUBLIC_USER;

const getAddressListByUserId = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      if (userData) {
        const findPattern = {
          url: addressUrl,
          key: "userId",
          value: userData?.id,
        };
        const addressList = await fetchWrapperService.find(findPattern);
        resolve(helperFunctions.sortByField(addressList));
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const addNewAddress = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        isDefault,
        firstName,
        lastName,
        company,
        address,
        apartment,
        city,
        state,
        pinCode,
        country,
        mobile,
      } = sanitizeObject(params);
      isDefault = isDefault ? JSON.parse(isDefault) : false;
      firstName = firstName ? firstName?.trim() : null;
      lastName = lastName ? lastName?.trim() : null;
      company = company ? company?.trim() : null;
      address = address ? address?.trim() : null;
      apartment = apartment ? apartment?.trim() : null;
      city = city ? city?.trim() : null;
      state = state ? state?.trim() : null;
      pinCode = pinCode ? Number(pinCode) : null;
      country = country ? country?.trim() : null;
      mobile = mobile ? Number(mobile) : null;

      const currentUser = helperFunctions.getCurrentUser();
      if (currentUser) {
        const userId = currentUser.id;
        if (
          firstName &&
          lastName &&
          address &&
          city &&
          state &&
          pinCode &&
          country &&
          mobile &&
          userId
        ) {
          const userData = await fetchWrapperService.findOne(userUrl, {
            id: userId,
          });
          if (userData) {
            if (isDefault) {
              let addressList = await getAddressListByUserId();

              if (addressList?.length) {
                let defaultAddress = addressList?.find((x) => x?.isDefault);
                if (defaultAddress) {
                  const payload = {
                    ...defaultAddress,
                    isDefault: false,
                    updatedDate: Date.now(),
                  };
                  const updatePattern = {
                    url: `${addressUrl}/${defaultAddress?.id}`,
                    payload,
                  };
                  await fetchWrapperService
                    ._update(updatePattern)
                    .then(() => {})
                    .catch(() => {
                      reject(
                        new Error(
                          "An error occurred during update default address."
                        )
                      );
                      return false;
                    });
                }
              }
            }

            const uuid = uid();
            let insertPattern = {
              isDefault,
              firstName,
              lastName,
              company,
              address,
              apartment,
              city,
              state,
              pinCode,
              country,
              mobile,
              userId,
              id: uuid,
              createdDate: Date.now(),
              updatedDate: Date.now(),
            };
            const createPattern = {
              url: `${addressUrl}/${uuid}`,
              insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                resolve(createPattern);
              })
              .catch((e) => {
                reject(
                  new Error("An error occurred during creating a new address.")
                );
              });
          } else {
            reject(new Error("user not found!"));
          }
        } else {
          reject(new Error("Invalid Data"));
        }
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateAddress = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        isDefault,
        firstName,
        lastName,
        company,
        address,
        apartment,
        city,
        state,
        pinCode,
        country,
        mobile,
        addressId,
      } = sanitizeObject(params);

      const currentUser = helperFunctions.getCurrentUser();
      if (currentUser) {
        const userId = currentUser?.id;
        if (addressId && userId) {
          const userData = await fetchWrapperService.findOne(userUrl, {
            id: userId,
          });
          if (userData) {
            const findPattern = {
              id: addressId,
            };

            const addressData = await fetchWrapperService.findOne(
              addressUrl,
              findPattern
            );

            if (addressData) {
              isDefault = isDefault
                ? JSON.parse(isDefault)
                : addressData.isDefault;
              firstName = firstName
                ? firstName?.trim()
                : addressData?.firstName;
              lastName = lastName ? lastName?.trim() : addressData?.lastName;
              company = company ? company?.trim() : addressData?.company ?? "";
              address = address ? address?.trim() : addressData?.address;
              apartment = apartment
                ? apartment?.trim()
                : addressData?.apartment ?? "";
              city = city ? city?.trim() : addressData?.city;
              state = state ? state?.trim() : addressData?.state;
              pinCode = pinCode ? Number(pinCode) : addressData?.pincode;
              country = country ? country?.trim() : addressData?.country;
              mobile = mobile ? Number(mobile) : addressData?.mobile;

              if (isDefault) {
                let addressList = await getAddressListByUserId();

                if (addressList?.length) {
                  const defaultAddress = addressList?.find((x) => x?.isDefault);

                  if (defaultAddress) {
                    const payload = {
                      ...defaultAddress,
                      isDefault: false,
                      updatedDate: Date.now(),
                    };
                    const updatePattern = {
                      url: `${addressUrl}/${defaultAddress?.id}`,
                      payload,
                    };
                    await fetchWrapperService
                      ._update(updatePattern)
                      .then(() => {})
                      .catch(() => {
                        reject(
                          new Error(
                            "An error occurred during update default address."
                          )
                        );
                        return false;
                      });
                  }
                }
              }

              let payload = {
                firstName,
                lastName,
                address,
                city,
                state,
                pinCode,
                country,
                mobile,
                addressId,
                apartment,
                company,
                isDefault,
                updatedDate: Date.now(),
              };
              const updatePattern = {
                url: `${addressUrl}/${addressId}`,
                payload,
              };

              fetchWrapperService
                ._update(updatePattern)
                .then((response) => {
                  resolve(updatePattern);
                })
                .catch((e) => {
                  reject(
                    new Error("An error occurred during updating address.")
                  );
                });
            } else {
              reject(new Error("Address not found!"));
            }
          } else {
            reject(new Error("user not found!"));
          }
        } else {
          reject(new Error("Invalid Data"));
        }
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteAddress = (addressId) => {
  return new Promise(async (resolve, reject) => {
    try {
      addressId = sanitizeValue(addressId) ? addressId.trim() : null;
      if (addressId) {
        const userData = helperFunctions.getCurrentUser();
        if (userData) {
          const findPattern = { id: addressId };
          const addressData = await fetchWrapperService.findOne(
            addressUrl,
            findPattern
          );

          if (addressData) {
            if (addressData?.userId === userData?.id) {
              await fetchWrapperService
                ._delete(`${addressUrl}/${addressId}`)
                ?.then(() => resolve(true))
                .catch(() =>
                  reject(
                    new Error("An error occurred during delete a address!")
                  )
                );
            } else {
              reject(new Error("unAuthorized"));
            }
          } else {
            reject(new Error("Address not found!"));
          }
        } else {
          reject(new Error("unAuthorized"));
        }
      } else {
        reject(new Error("Invalid Id"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const validateAddress = async (payload, abortController) => {
  const signal = abortController?.signal;
  const response = await axios.post(
    `${apiUrl}/address/validateAddress`,
    sanitizeObject(payload),
    { signal }
  );
  return response.data;
};

export const addressService = {
  getAddressListByUserId,
  addNewAddress,
  updateAddress,
  deleteAddress,
  validateAddress,
};
