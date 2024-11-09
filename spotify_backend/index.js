
const express = require('express'); 
const app = express();  
const port = 7000
const mongoose = require("mongoose")
require('dotenv').config() 
//console.log(process.env) // remove this after you've confirmed it is working
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt; // like c++ declatration of variables ( int a, b)  
const passport = require('passport') // passport is a framework for authentication 
const User = require('./models/User') // exports Usermodel 
const authroutes = require('./routes/auth')  
const songroutes = require('./routes/song')  
const playlistRoutes = require('./routes/playlist') 
const cors = require('cors')



app.use(express.json())//Parses incoming JSON payloads and makes the data available in req.body as a JavaScript object. 
app.use(cors())

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.identifier}).then((user)=>{ 
        if(user)
        return done(null,user) 
        else 
        return done(null,false)
    }).catch((err)=>{
        return done(null,false)
    });
}));




//connection with mongoDB
mongoose.connect("mongodb+srv://pratham-last-connect:"+
    process.env.Password +
    "@cluster0.cqk5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then((x)=>{
    console.log("MongoDB successfully connected")
}).catch((err)=>{
    console.log(err)
}) 



// always use forward slashes in your routes for Express.js APIs. 
//mongoose connects mongoDB with backend 
//now backend is running on local server(this system) we can upload it in cloud after hosting. 
app.get('/',(req,res)=>{
    res.send('hello world')
})  

app.use('/auth',authroutes)  
app.use('/song',songroutes) 
app.use('/playlist',playlistRoutes)

app.listen(port,()=>{
    console.log('App is running on the local host ',port)
})
   






