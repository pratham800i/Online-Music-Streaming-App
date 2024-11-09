const mongo = require('mongoose') 
const song = new mongo.Schema({
    name: {
        type: String, 
        required: true
    } ,

    thumbnail: {
        type: String,// link of the image will be here 
        required: true
    }  , 

    track: {
        type: String, 
        required: true

    },  
    
    artists:{
       type: mongo.Types.ObjectId, 
       ref: "User"
    }

}) 
const songmodel = mongo.model("song",song) 
module.exports = songmodel