export const menuSubCategoryModel = {
    createdDate:Date,
    id:{
        type:String,
        unique:true
    },
    title: {
        type:String,
        unique:true
    },
    categoryId : {
        type:String,
        ref:'categories'
    }
};
