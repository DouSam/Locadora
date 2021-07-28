const Session = require("../models/session");

/**
 * Middleware to check if user as logged and update session cookie
 * @async
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var cookieHandlerF = async function(req,res,next) {
    
    if(req.url.indexOf("/login") != -1 || req.url.indexOf("/register") != -1) {
        return next();
    }

    var msg = "";
    
    var filter = {
        ses : req.cookies.session,
        uid : req.cookies.userID,
        mxa : {
            "$gt" : Date.now()
        }
    }

    var session = await Session.findOne(filter);

    // Check if the request has a session cookie
    if(Object.keys(req.cookies).length == 0 || session == null) {
        msg = "Por favor, realize o login.";

        //Redirect to login page
        return res.redirect(`/login?msg=${msg}&msgInd=1`);

    } else { // Refreshing the cookies
        let opts = {
            maxAge : 1000 * 60 * 5
        };
            
        // Changing cookies
        res.cookie("session", req.cookies.session, opts); 
        res.cookie("userID", req.cookies.userID, opts); 
        req.cookies = null;

        // Updating the session
        session.mxa = Date.now() + opts.maxAge;
        await session.save();
        
        next();
    }
}

module.exports = {
    cookieHandlerF:cookieHandlerF
};