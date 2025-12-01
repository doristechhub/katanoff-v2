const {
  setCollectionsData,
  setCollectionsLoading,
  setCollectionMessage,
  setCollectionsListLoading,
  setCollectionsList,
} = require("@/store/slices/collectionSlice");
const { collectionService } = require("@/_services");
const { messageType, SLIDER_GRID } = require("@/_helper");

const fetchCollectionsByTypes = (types) => {
  return async (dispatch) => {
    try {
      types = types?.filter((item) => item?.trim());

      if (!types.length) {
        dispatch(setCollectionsData([]));
        return [];
      }
      dispatch(setCollectionsLoading(true));

      const collections = await collectionService?.getAllCollection();
      const groupedData = types.map((type) => ({
        type,
        data: collections
          .filter((item) => item?.type?.trim() === type?.trim())
          .map((collection) => ({
            ...collection,
            title: collection.title,
            image: collection.thumbnailImage,
            title: collection.title || "",
            alt: collection.title || "",
            btnText: type !== SLIDER_GRID ? "SHOP NOW" : undefined,
            id: collection.id,
          }))
          .sort((a, b) => a.position - b.position),
      }));
      dispatch(setCollectionsData(groupedData));

      return groupedData;
    } catch (e) {
      dispatch(
        setCollectionMessage({
          message: e?.message || "Something went wrong",
          type: messageType.ERROR,
        })
      );
    } finally {
      dispatch(setCollectionsLoading(false));
    }
  };
};

const fetchAllCollections = () => {
  return async (dispatch) => {
    try {
      dispatch(setCollectionsListLoading(true));

      const collections = await collectionService?.getAllCollection();

      const formattedCollections = collections
        .map((collection) => ({
          ...collection,
          image: collection.thumbnailImage,
        }))
        .sort((a, b) => a.position - b.position);
      dispatch(setCollectionsList(formattedCollections));
      return formattedCollections;
    } catch (e) {
      dispatch(
        setCollectionMessage({
          message: e?.message || "Something went wrong",
          type: messageType.ERROR,
        })
      );
    } finally {
      dispatch(setCollectionsListLoading(false));
    }
  };
};

const fetchCollectionByTitle = (title) => {
  return async (dispatch) => {
    try {
      dispatch(setCollectionsLoading(true));

      const collection = await collectionService.getCollectionByTitle(title);

      if (!collection) {
        dispatch(
          setCollectionMessage({
            message: "Collection not found",
            type: messageType.ERROR,
          })
        );
        return null;
      }

      dispatch(setCollectionsData([collection]));
      return collection;
    } catch (e) {
      dispatch(
        setCollectionMessage({
          message: e?.message || "Something went wrong",
          type: messageType.ERROR,
        })
      );
      return null;
    } finally {
      dispatch(setCollectionsLoading(false));
    }
  };
};

module.exports = {
  fetchCollectionsByTypes,
  fetchCollectionByTitle,
  fetchAllCollections,
};
