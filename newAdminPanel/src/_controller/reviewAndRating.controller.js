import { reviewAndRatingUrl, fetchWrapperService } from '../_helpers';
import { productService, usersService } from '../_services';

const getReviewAndRatingsData = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(reviewAndRatingUrl);
      const rrData = respData ? Object.values(respData) : []
      const usersData = await usersService.getAllUserList();
      const productData = await productService.getAllActiveProducts()
      const updatedReviewAndRatingData = rrData.map(review => {
        const user = usersData.find(user => user.id === review?.userId);
        const product = productData.find(product => product.id === review?.productId);
        if (user) {
          review.name = `${user.firstName} ${user.lastName}`;
          review.email = user.email;
        }
        if(product){
          review.productName = product.productName;
        }
        return review;
      });
      resolve(updatedReviewAndRatingData)
    }catch(e){
        reject(e);
    }
  })
}

export const reviewAndRatingController = {
  getReviewAndRatingsData
};