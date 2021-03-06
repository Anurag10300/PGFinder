const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({

    nickName:{
        type:String
    },
    pgName :{
        type:String
    },
    ownerName :{
        type:String
    },
    ownerNumber : {
        type:Number
    } ,
    address: {
        type:String
    },
    rooms: {type: Number},
    kitchen: {type:String},
    mess : {type: String},
    rent : {type : Number},
    description : {type : String}
}
);


module.exports = User = mongoose.model('User', userSchema);