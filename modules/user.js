var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/pms",{
    useNewUrlParser: true, 
    useUnifiedTopology:true, 
    useCreateIndex: true
}).then(()=>{
    console.log("connection successfull");
}).catch((e)=>{
    console.log("no connection");
})
var conn = mongoose.connection;
var userSchema = new mongoose.Schema({
    username: {type:String,
        required: true,
        index:{
            unique:true,
        }
    },
    email: {
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    password:{
        type:String,
        required:true
    },  
    date:{
        type:Date,
        default:Date.now
    }  
});
var userModel = mongoose.model('User',userSchema);
module.exports = userModel;
//console.log(userSchema);