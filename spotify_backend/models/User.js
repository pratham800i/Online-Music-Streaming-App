const mongo = require('mongoose')  
const User = new mongo.Schema({  
    //jsons 
    firstName: {
        type: String, 
        required: true //by default it is true
    },  

    lastName: {
        type: String, 
        required: false
    }, 
    
    password: {
        type: String, 
        required: true, 
        private: true
    },
 
    email: {
        type: String, 
        required: true
    }, 

    likedSongs:{
        type: String, // although we will do it array of string later which will contain reference of the songs 
        default: ""
    },

    subscribedArtists:{
      type: String, 
      default: ""
    },  

    likePlayLists:{
        type: String, 
        default: ""
    },

    username: {
        type: String, 
        required: true
    }

}) 

const Usermodel = mongo.model("User",User)  
module.exports = Usermodel

