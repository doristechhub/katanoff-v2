export const recentlyViewedModel = {
    id:{
        type:String,
        unique:true
    },
    userId: {
        type:String,
        ref: 'user',
    },
    productId : {
        type:String,
        ref:'products',
        unique:true
    },
    createdDate:Date,
    updatedDate:Date,
};
