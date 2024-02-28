import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    first_name:{
        type:String,
        require: true
    },
    last_name:{
        type:String,
        require: true
    },
    age:{
        type:Number,
        require: true
    },
    email:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
    /* md5, funciones criptograficas para password, hashearla (A56) */
});

export default mongoose.model("Users", UsersSchema)