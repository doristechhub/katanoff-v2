import { fetchWrapperService, helperFunctions, menuUrl } from "@/_helper";

export const getAllMenuData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await fetchWrapperService.getAll(menuUrl);
      const categories = menuData?.categories
        ? Object.values(menuData?.categories)
        : [];
      const subCategories = menuData?.subCategories
        ? Object.values(menuData?.subCategories)
        : [];
      const productTypes = menuData?.productType
        ? Object.values(menuData?.productType)
        : [];
      resolve({ categories, subCategories, productTypes });
    } catch (e) {
      reject(e);
    }
  });
};

export const getAllMenuList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await getAllMenuData();

      // Modified to include parent subcategory information in product type links
      const subCategoryWiseProductType = (
        subCategoryId,
        subCategoryTitle,
        categoryTitle
      ) => {
        return menuData.productTypes
          .filter((productType) => productType.subCategoryId === subCategoryId)
          .sort((a, b) => a.position - b.position) // Sort product types by position
          .map((productType) => {
            const type = "productTypes";
            const encodedProductType =
              helperFunctions.stringReplacedWithUnderScore(productType?.title);
            const encodedSubCategory = encodeURIComponent(subCategoryTitle);
            const encodedCategory = encodeURIComponent(categoryTitle);

            return {
              id: productType.id,
              type,
              title: productType.title,
              href: `/collections/${type}/${encodedProductType}?parentCategory=${encodedSubCategory}&parentMainCategory=${encodedCategory}`,
              parentCategory: subCategoryTitle,
              parentMainCategory: categoryTitle,
            };
          });
      };

      const categoryWiseSubCategory = (categoryId, categoryTitle) => {
        return menuData.subCategories
          .filter((subCategory) => subCategory.categoryId === categoryId)
          .sort((a, b) => a.position - b.position) // Sort subcategories by position
          .map((subCategory) => {
            const type = "subCategories";
            const encodedSubCategory =
              helperFunctions.stringReplacedWithUnderScore(subCategory?.title);
            const encodedCategory = encodeURIComponent(categoryTitle);

            return {
              id: subCategory.id,
              type,
              title: subCategory.title,
              href: `/collections/${type}/${encodedSubCategory}?parentMainCategory=${encodedCategory}`,
              parentMainCategory: categoryTitle,
              productTypes: subCategoryWiseProductType(
                subCategory.id,
                subCategory.title,
                categoryTitle
              ),
            };
          });
      };

      const sortedCategories = menuData.categories.sort(
        (a, b) => a.position - b.position
      );

      const menuList = sortedCategories.map((category) => {
        const type = "categories";
        return {
          id: category.id,
          type,
          title: category.title,
          href: `/collections/${type}/${helperFunctions.stringReplacedWithUnderScore(
            category?.title
          )}`,
          subCategories: categoryWiseSubCategory(category.id, category.title),
        };
      });

      resolve(menuList);
    } catch (e) {
      reject(e);
    }
  });
};

export const homeService = {
  getAllMenuList,
  getAllMenuData,
};
