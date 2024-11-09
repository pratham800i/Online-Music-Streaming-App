const express = require('express') 
const router = express.Router() 
const playlist = require('../models/playlist')    
const passport = require('passport')   
const song = require('../models/song')
const User = require('../models/User')

//Route: 1 -> Create a playlist   

router.post('/create', passport.authenticate("jwt", {session: false}), async (req,res)=>{
    //add songs by id  
    const {name, thumbnail, songs} = req.body  
    if(!name || !thumbnail || !songs){
        return res.status(400).send({err:"Insufficient information"})
    } 
    const playList = await playlist.create({name, thumbnail, songs, collaborators:[], owner:req.user._id })  
    return res.status(200).json(playList)  

})  

//Route:2 -> Get a playlist by Id   
//we wont send any body with get request, from now we will use req.params method  

router.get('/get/playlist/:playListId', passport.authenticate("jwt", {session:false}), async(req,res)=>{
      const playListId = req.params.playListId  
      const playList = await playlist.findOne({_id: playListId}).populate({ 
        path: "songs", 
        populate:{
            path:"artists"
        }   
      });

      if(!playList){
        return res.status(400).send("No playlist found")
      }  
      return res.status(200).send(playList)
})  
//Route:2 -> Get playlist created by the user   
//we wont send any body with get request, from now we will use req.params method  

router.get('/get/me', passport.authenticate("jwt", {session:false}), async(req,res)=>{
      const playLists = await playlist.find({owner:req.user._id}); 
      res.status(200).send(playLists);
})  

//get all playlist created by an artist  
router.get('/get/artist/:artistId', passport.authenticate("jwt",{session:false}), async (req,res)=>{
     //first check if artist exists (optional) 
     const artistId  = req.params.artistId 
     const artist = await User.findOne({_id:artistId})  
     if(!artist){
        return res.status(303).json({err: "Artist does not exist"}) //used for redirection
     }  
     const playList = await playlist.find({owner:artistId})  
     return res.status(200).json(playList)
})   

//Add song to a particular playlist  
router.post('/add/song', passport.authenticate("jwt",{session:false}), async (req,res)=>{
    const {playListId, songId} = req.body 
    const currentUser = req.user
    //check if this playlist id exist  
    const playList = await playlist.findOne({_id: playListId}) 
    if(!playList){
        return res.status(304).json({err: "this playList does not exist"})
    }  
    
    //this is string
     // for checking error  
    //we can't compare two objects by '==' or '===' operator 

    //check if this user has right to add songs in the playlist i.e he is owner or collaborator  
    if(!(playList.owner.equals(currentUser._id)) && !(playList.collaborators.includes(currentUser._id))){
        return res.status(400).json({err:"You can't add songs to this playlist"
        })  
    }  
   
    //check if this song is valid  
   if (!await song.findOne({_id: songId})){
    return res.status(300).json({err:"Song not found"})
   } 

    playList.songs.push(songId) 
    playList.save() 
    return res.status(200).json(playList) 
})
module.exports = router 