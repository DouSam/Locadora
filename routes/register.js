const express = require("express");
const router  = express.Router({ mergeParams: true });
const crypto  = require("crypto");
const bcrypt  = require("bcrypt");
const User    = require("../models/user");

router.get("", async (req,res)=> {

    // Rendering the register page
    res.render("../views/register/register",{msg:req.query.msg,msgInd:req.query.msgInd})
})

router.post("", async (req,res)=>{

    var userData = req.body;

    var msg = "";

    var filter = {
        "$or" : [
            {
                cpf : userData.cpf
            },
            {
                usr : userData.usr
            }
        ]
    }

    //Check if exists a user with the username or CPF inserted
    var userQuery = await User.find(filter).exec()

    if(userQuery.lenght) {
        msg = "Usuário já cadastrado, por favor logue!"
        res.redirect(`/login?msg=${msg}&msgInd=1`)
    } else { // The user is not registered yet
        const saltRounds = 10;

        // Criptografing the password
        var preHash = crypto.createHash('sha256').update(userData.psw,'utf8').digest();
        var hash = await bcrypt.hash(preHash,saltRounds);

        // Force exclusion of the plain password 
        preHash = null;
        req.body.psw = null;
        userData.psw = hash;

        // Generate a unique token to pass in cookies
        var token;
        do {
            token = crypto.randomBytes(15).toString('hex');
        } while(await User.findOne({uid:token}).exec() != null);

        // Replacing the data and saving the User
        userData.uid = token;
        var userCreate = await new User(userData).save();

        // Redirect to login page
        msg = "Usuário criado com sucesso, por favor logue!"
        res.redirect(`/login?msg=${msg}&msgInd=0`)
    }
})

module.exports = router;