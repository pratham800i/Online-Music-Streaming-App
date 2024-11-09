const jwt = require('jsonwebtoken')
 exports = {}  
exports.gettoken = (email, user)=>{
    token = jwt.sign({identifier: user._id},"secret") 
    return token
} 

module.exports = exports

