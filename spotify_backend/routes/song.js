const express = require('express') 
const router = express.Router()  
const song = require("../models/song")  
const passport = require('passport') 
const User = require('../models/User')

router.post('/create',passport.authenticate("jwt",{session:false}), async (req,res)=>{  //passport.authenticate is used to login the user executes before callback 
   //req.user gets the user whose token we got at the time of login because of passport.authenticate 


   //step1: take value of name, thumbnail, track from user 
   //step2: fetch his user._id  
   //step3: make a entry into DB  
   //step4: return the token to user 

   const {name, thumbnail, track} = req.body  
   if(!name || !thumbnail || !track){
    return res.status(301).json({error:"Provide necessary details"})
   } 
   const newSong = await song.create( {name, thumbnail, track, artists: req.user._id})  
   return res.status(200).send(newSong) //or we can use res.status(200).json(newSong) // or i can use res.status(200).send(newSong.toJson()) 
   //send() javaScript objects or arrays ko json format me hi bhejta hai by default
})

//get the songs that a particular user created:  
//means he will send just his token and after authorization we'll send him all his songs  

router.get('/get/songs', passport.authenticate("jwt",{session:false}), async (req,res)=>{
    const createdSongs =  await song.find({artists: req.user._id}).populate("artists") //array of javaScript objects  
    if(createdSongs.length===0){
        return res.status(300).send("you have not created any songs")
    }  
    return res.status(200).json(createdSongs) 
})

//get the songs of an artist  searched by any user  

router.get('/get/artist/:artistId', passport.authenticate("jwt",{session:false}), async (req,res)=>{ 
    const artistId = req.params.artistId
      
    //checking if artist exists  
    if(! await User.findOne({_id:artistId})){
        return res.status(300).json({err: "Artist does not exists"})
    } 
    const artistSongs = await song.findOne({ artists: artistId }) 
   
    return res.status(200).json(artistSongs)
})  

//get the song by name  
router.get('/get/song/:songName', passport.authenticate('jwt',{session:false}), async (req,res)=>{
    const name = req.params.songName
    const Song = await song.find({name: name}).populate("artists")  
    
    res.status(200).json({data:Song}) 
})

module.exports = router 

/*
return res.status(200).send(createdSongs.toJSON())   
is it right code for alternative?
No, calling toJSON() directly on createdSongs will not work in this case. The createdSongs is an array of documents
 (because find() returns an array), and toJSON() is a method that works on individual Mongoose documents, not arrays. 
 */