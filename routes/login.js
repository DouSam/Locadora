//#region Import region
const express = require("express");
const router  = express.Router({ mergeParams: true });
const crypto  = require("crypto");
const bcrypt  = require("bcrypt");
const User    = require("../models/user");
const Session = require("../models/session");
//#endregion

router.get("",async (req,res)=>{

    // Rendering login page
    res.render("../views/login/login",{msg:req.query.msg,msgInd:req.query.msgInd})
})

router.post("",async(req,res)=>{

    // Checking if exists a user with the username inserted
    var usersQuery = await User.findOne(
        {
            usr:req.body.usr
        }
    ).exec();

    var msg = "";
    
    // If the query return a empty array
    if(usersQuery == null) {
        msg = "Usuário não cadastrado, por favor, registre-se!"
        res.redirect(`/register?msg=${msg}&msgInd=1`)
    } else { // No empty array, so we check if the password is correctly

        // Criptografing the password
        var preHash = crypto.createHash('sha256').update(req.body.psw,'utf8').digest();
        var checker = await bcrypt.compare(preHash,usersQuery.psw);

        // Checking if the password inserted is equal to the password in the database
        if(checker) {
            
            var sessionNumber = crypto.randomBytes(10).toString('hex');
            let opts = {
                maxAge : 1000 * 60 * 5 
            };
            
            let session = {
                ses : sessionNumber,
                uid : usersQuery.uid,
                mxa : Date.now() + opts.maxAge
            }

            // Changing cookies
            req.cookies = null;
            res.cookie("session", sessionNumber, opts); // Creating the session cookie to expire in 5 minutes
            res.cookie("userID", usersQuery.uid, opts); // Creating the session cookie to identify the user
            await Session.create(session);

            msg = "Usuário logado com sucesso.";
            res.redirect(`/?msg=${msg}&msgInd=0`);
        } else {
            msg = "Senha incorreta!"
            res.redirect(`/login?msg=${msg}&msgInd=1`)
        }
    }
})

module.exports = router;