export const reviewModel = {
    createdDate:Date,
    updatedDate:Date,
    id:{
        type:String,
        unique:true
    },
    userId:{
        type:String
    },
    productId: {
        type:String
    },
    name: {
        type:String
    },
    email: {
        type:String
    },
    review: {
        type:String
    },
    stars: {
        type:String
    },
    userType:{
        type:Number,
        enum:[0,1],
        default:0 //0-login_User 1-guest_User
    },
};