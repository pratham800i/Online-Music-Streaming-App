const mongoose = require('mongoose') 
const playlist =  new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 

    thumbnail:{
        type: String, 
        required: true
    }, 

    songs: [{
        type: mongoose.Types.ObjectId, // mongoose creates a unique id for every object in the schema whose type is this. 
        ref: "song"
    }], //array

    collaborators:[{
        type: mongoose.Types.ObjectId, 
        ref: "User"
    }], 
    owner: {
        type: mongoose.Types.ObjectId, 
        ref: "User"
    }
}) 

const playmodel = mongoose.model("playlist",playlist) 
module.exports = playmodel 