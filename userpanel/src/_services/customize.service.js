import { customizedProductSettingsUrl, fetchWrapperService } from "../_helper";

const fetchCustomizeProductSettings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(
        customizedProductSettingsUrl
      );
      if (respData) {
        resolve(respData);
        return;
      }
    } catch (error) {
      console.error("Error fetching customized product settings:", error);
      reject(error);
    }
  });
};

export const customizeService = {
  fetchCustomizeProductSettings,
};
