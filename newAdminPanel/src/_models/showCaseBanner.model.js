export const showCaseBannerModel = {
    createdDate:Date,
    id:{
        type:String,
        unique:true
    },
    productId: {
        type:String,
        unique:true,
        ref:'product'
    }
};
