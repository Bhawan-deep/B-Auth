import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  verifyOtp:{type:String,default:''},
  OtpExpireAt:{type:Number,default:0},
   isAccountVerified:{type:Boolean,default:false},
   resetOtp:{type:String,default:''},
 resetOtpExpireAt:{type:Number,default:0}


})
export default mongoose.model("User",UserSchema);