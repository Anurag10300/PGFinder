require('dotenv').config();
const password = process.env.DB_USER1_PASS;
const db_name = process.env.DB_NAME;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://User1:"+password+"@pgdetails.zbdmq.mongodb.net/"+db_name+"?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});