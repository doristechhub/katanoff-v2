import { fetchWrapperService, settingStyleUrl } from "../_helper";

const getAllSettingStyles = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(settingStyleUrl);
      const settingStyleData = respData ? Object.values(respData) : [];
      resolve(settingStyleData);
    } catch (e) {
      reject(e);
    }
  });
};

export const settingStyleService = {
  getAllSettingStyles,
};
