const express = require('express') 
const router =  express.Router() //it importes only funcitons related to routing like .get(), .post() etc. it saves us from overloading of stack of functions 
const User = require('../models/User') 
const bcrypt = require('bcrypt')  
const {gettoken} = require('../utils/helpers')  



router.post("/register",async (req,res)=>{ 

    console.log(req.body)

    const {email, password, firstName,  lastName, username} = req.body // destructurising (initializing multiple variable with object)
    // checking if this user exists already or not 
    const user = await User.findOne({email:email}) ///The findOne function returns a document (object) from the database if a match is found
    if(user){
        return res.status(400).json({error:"this user already exists"})
    }  
    //otherwise create a user   
    //We can't directly store the password in DB which we got from client side or frontend because if our DB is hacked then all profiles of the user will be accessible by the hacker 
    // Also my website will not be trustable becuase i have direct access to password of the profiles 
    // so i store hashed password. it makes actual password very long and even if i see hashed password or hacker sees it, he/me won't be able to convert it into actual password  
    const hashedPassword = await bcrypt.hash(password,10) //second argument represents security levels 10 is balance the higher it is more secure it is and also more slower application is so use balanced value
    const newUserData = {email, password: hashedPassword, firstName, lastName, username} 
    const newUser = await User.create(newUserData)  

    //now after new User added to database we want to send a token to client side then browser will store it and use later to log in 
    const token = await gettoken(email, newUser)// it will be defined in another file  
    //return the result  user 
    const userToReturn = {...newUser.toJSON(), token} 
    delete userToReturn.password; //it is a security measure we don't share hashedPassword to the user in token  
    return res.status(200).json(userToReturn)
    
});  

router.post('/login',async (req,res)=>{
    //step1: check if email is matched 
    //step2 : check if password matches 
    //step3: returns the token  

    const {email,password} = req.body; 
    const user = await User.findOne({email:email}) 
    if(!user){
        return res.status(402).json({error:"email is invalid"}) 
    } 
    const isPasswordValid =  await bcrypt.compare(password, user.password) 
    if(!isPasswordValid){
       return res.status(400).json({error:"Password is invalid"}) 
    }  
    const token = await gettoken(email,user) 
    const userToReturn = {...user.toJSON(), token} 
    delete userToReturn.password 
    return res.status(200).json(userToReturn)
})

module.exports = router

//Asynchronous Code: Since working with databases and hashing takes time, 
//you use async/await to handle these processes without blocking the rest of the code.

/*
If you are working with authentication, it's essential to have a password field in your User model.
If you don't include it, Mongoose will ignore any attempt to store a password, and users won't be able to log in.
To handle passwords securely, always hash them (as you are doing with bcrypt) before storing them in the database.
*/

/*
Suppose i hav'e defined user model in other file and it contains a field name 'Email' but in the above code in newUserData it is named as 'email' will it get stored then it database?
No, it won't be stored in the database as expected if the field names in your code (e.g., email) do not match the field names defined in your Mongoose model (e.g., Email). 
Mongoose is case-sensitive when it comes to schema field names.
*/ 

/*
When you use await, you are telling JavaScript to pause the execution of the login logic until bcrypt.compare() finishes comparing the passwords and returns a result (either true or false).
and same for other functions too. while await is only used inside async function, where as async function uses non blocking I/O model and returns promises. 
*/ 

//Even if VSCode gives a warning, the await is necessary for the function to work correctly and securely in the login authentication process.