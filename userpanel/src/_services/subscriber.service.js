import { uid } from "uid";
import {
  subscribersUrl,
  fetchWrapperService,
  sanitizeObject,
} from "../_helper";

const addNewSubscriber = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email } = sanitizeObject(params);
      email = email ? email?.trim() : null;
      if (email) {
        const emailPattern = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const emailResult = emailPattern.test(email);
        if (emailResult) {
          const findPattern = {
            email,
          };

          const subscriberData = await fetchWrapperService.findOne(
            subscribersUrl,
            findPattern
          );
          if (subscriberData) {
            resolve(true);
            return true;
          }
          const uuid = uid();
          let insertPattern = {
            email,
            id: uuid,
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };
          const createPattern = {
            url: `${subscribersUrl}/${uuid}`,
            insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(createPattern);
            })
            .catch((e) => {
              reject(
                new Error("An error occurred during creating a new subscriber.")
              );
            });
        } else {
          reject(new Error("Please enter valid E-mail"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const subscribersService = {
  addNewSubscriber,
};
