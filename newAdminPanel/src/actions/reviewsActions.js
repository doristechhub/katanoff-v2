import { toast } from 'react-toastify';

import { toastError } from '.';
import { reviewAndRatingService } from 'src/_services';
import { setCrudReviewLoading } from 'src/store/slices/reviewAndRatingSlice';

// ----------------------------------------------------------------------

export const deleteReview = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudReviewLoading(true));
    const res = await reviewAndRatingService.deleteReviewAndRating(payload);

    if (res) {
      toast.success('Review deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudReviewLoading(false));
  }
};
