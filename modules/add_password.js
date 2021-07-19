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
var passwordSchema = new mongoose.Schema({
    category_name: {type:String,
        required: true,
        index:{
            unique:true,
        }
    },
    password_detail: {
        type:String,
        required:true,
        
    },
    
    date:{
        type:Date,
        default:Date.now
    }  
});
var passwordModel = mongoose.model('Passwordetail',passwordSchema);
module.exports = passwordModel;
//console.log(userSchema);