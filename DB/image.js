var mongoose = require('mongoose');
  
var ImageSchema = new mongoose.Schema({
    id: String,
    
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('Image', ImageSchema);