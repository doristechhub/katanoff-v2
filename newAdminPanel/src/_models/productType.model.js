export const productTypeModel = {
    createdDate:Date,
    id:{
        type:String,
        unique:true
    },
    title: {
        type:String,
        unique:true
    },
    subCategoryId : {
        type:String,
        ref:'subCategories'
    },
    categoryId : {
        type:String,
        ref:'categories'
    }
};
