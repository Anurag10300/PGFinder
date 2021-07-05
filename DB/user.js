const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    ownerName :{
        type:String
    },
    ownerNumber : {
        type:Number
    } ,
    address1: {
        type:String
    },
    address2: {
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