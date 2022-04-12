const mongoose = require("mongoose");

require('dotenv').config();
const password = process.env.DB_USER1_PASS;
const db_name = process.env.DB_NAME;

//const uri = "mongodb+srv://User1:" + password + "@pgdetails.zbdmq.mongodb.net/" + db_name + "?retryWrites=true&w=majority";

const uri = "mongodb://User1:" +password+ "@pgdetails-shard-00-00.zbdmq.mongodb.net:27017,pgdetails-shard-00-01.zbdmq.mongodb.net:27017,pgdetails-shard-00-02.zbdmq.mongodb.net:27017/"+db_name+"?ssl=true&replicaSet=atlas-4on2gl-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(uri , { useNewUrlParser: true , useUnifiedTopology: true });
    console.log("DB connected");
}



module.exports = connectDB;


