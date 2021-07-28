var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
    {
        usr : String, // Username
        psw : String, // Password
        nam : String, // Name
        eml : String, // E-mail
        cpf : Number, // CPF
        nrg : Number, // RG
        uid : String  // Unique ID for cookies 
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("User", UserSchema);