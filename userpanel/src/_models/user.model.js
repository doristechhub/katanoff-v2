export const userModel = {
    id:{
        type:String,
        unique:true
    },
    firstName :{
        type:String,
    },
    lastName :{
        type:String,
    },
    email: {
        type:String,
        unique:true
    },
    password: {
        type:String
    },
    otp: {
        type: Number,
    },
    createdDate:Date,
    updatedDate:Date
};
