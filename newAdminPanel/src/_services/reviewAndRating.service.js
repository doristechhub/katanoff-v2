import { toast } from 'react-toastify';
import { setReviewLoading, setReviewAndRatingsList } from '../store/slices/reviewAndRatingSlice';
import { reviewAndRatingController } from '../_controller/reviewAndRating.controller';
import {
  fetchWrapperService,
  helperFunctions,
  productsUrl,
  reviewAndRatingUrl,
  sanitizeObject,
} from '../_helpers';

export const getReviewAndRatingsList = () => async (dispatch) => {
  try {
    dispatch(setReviewLoading(true));
    dispatch(setReviewAndRatingsList([]));
    const reviewAndRatingData = await reviewAndRatingController.getReviewAndRatingsData();
    if (reviewAndRatingData) {
      let list = helperFunctions.sortByField(reviewAndRatingData);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setReviewAndRatingsList(helperFunctions.sortByField(list) || []));
      return list;
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setReviewAndRatingsList([]));
  } finally {
    dispatch(setReviewLoading(false));
  }
};

const deleteReviewAndRating = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { rrId } = sanitizeObject(params);
      if (rrId) {
        const rrData = await fetchWrapperService.findOne(reviewAndRatingUrl, {
          id: rrId,
        });
        if (rrData) {
          await fetchWrapperService._delete(`${reviewAndRatingUrl}/${rrId}`);
          const productData = await fetchWrapperService.findOne(productsUrl, {
            id: rrData.productId,
          });
          if (productData) {
            const totalReviews = Number(productData.totalReviews) - 1;
            const totalStar = Number(productData.totalStar) - Number(rrData.stars);
            const payload = {
              totalReviews,
              totalStar,
              starRating: parseFloat(helperFunctions.toFixedNumber(totalStar / totalReviews)),
              updatedDate: Date.now(),
            };
            const productUpdatePattern = {
              url: `${productsUrl}/${productData?.id}`,
              payload,
            };
            fetchWrapperService._update(productUpdatePattern);
          }
          resolve(true);
        } else {
          reject(new Error('review and rating not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const reviewAndRatingService = {
  getReviewAndRatingsList,
  deleteReviewAndRating,
};
